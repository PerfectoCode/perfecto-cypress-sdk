import logUpdate from 'log-update';
import chalk from 'chalk';
import { Table } from 'console-table-printer';
import axios from 'axios';
import { getBackendBaseUrl, getPerfectoHeaders } from './common/api';

const sessionDataMap = new Map();

const objectToHash = data => {
  return Object.values(data).map(item => typeof item === 'object' ? objectToHash(item) : item ).filter(item => item).join('-');
};

const getSessionDataLoop = (credentials, sessionId, startTime, resolve, reject) => {
  axios.get(getBackendBaseUrl(credentials.cloud) + '/sessions/' + sessionId, {
    headers: getPerfectoHeaders(credentials.cloud, credentials.securityToken)
  })
    .then(res => {
      const sessionData = res.data;
      // Update data cache
      sessionData.tests.forEach(testData => {
        const platformHash = objectToHash(testData.platform);
        if (!sessionDataMap.get(platformHash)) {
          sessionDataMap.set(platformHash, {
            platform: testData.platform,
            tests: [testData.testData]
          });
        } else {
          const platformData = sessionDataMap.get(platformHash);
          platformData.tests.push(testData.testData)
        }
      });

      if (sessionData.sessionState !== 'DONE') {
        logUpdate(printSessionData(sessionData.sessionState));
        setTimeout(() => getSessionDataLoop(credentials, sessionId, startTime, resolve, reject), 3000);
      } else {
        logUpdate(printSessionData(sessionData.sessionState, sessionId));
        logUpdate.done();
        if (sessionData.result === 'PASSE') {
          resolve();
        } else {
          reject(chalk.red(`Session ended with status: ${sessionData.sessionState}.`) + `${chalk.gray(printDuration(new Date().getTime() - startTime))}`);
        }
        // TODO: (Elhay) print reporting link
      }
    })
    .catch(reject);
}

const getPrintTitle = (status, sessionId) => {
  return `
++++++++++++++++++++++++++++++++++++
  Session status: ${status} - ${sessionId}
++++++++++++++++++++++++++++++++++++
  `;
}

const printDuration = duration => duration + 'ms';

const truncate = (text, length) => {
  if (!text || text.length <= length) {
    return text;
  }

  return text.slice(0, length) + '...';
};

const statusIcons = {
  PASSED: '✔︎',
  FAILED: '✖'
};

const printSessionData = (status, sessionId) => {
  const title = getPrintTitle(status, sessionId) + '\n';
  const specsMap = new Map();

  const testsPrintableData = [...sessionDataMap.entries()].map(([keyName, platformData]) => {
    const testsTable = new Table({
      title: keyName,
      columns: [
        {name: 'Test Name', alignment: 'left'},
        {name: 'Duration', alignment: 'left'},
        {name: 'Message', alignment: 'left', color: 'red'}
      ]
    });

    platformData.tests.forEach(test => {
      const specKey = keyName + '-' + test.specFile;
      const specData = specsMap.get(specKey);
      if (!specData) {
        specsMap.set(specKey, {
          platformKey: keyName,
          SPEC: test.specFile,
          Tests: 1,
          Status: test.status,
          Duration: test.duration,
          Passing: test.status === 'PASSED' ? 1 : 0,
          Failing: test.status !== 'PASSED' ? 1 : 0
        });
      } else {
        specData.Tests ++;
        specData.Duration += test.duration;

        if (test.status === 'PASSED') {
          specData.Passing ++;
        } else {
          specData.Failing ++;
          specData.Status = test.status;
        }
      }

      testsTable.addRow({
        'Test Name': statusIcons[test.status] + ' ' + test.testName,
        Duration: printDuration(test.duration),
        Message: test.status === 'FAILED' ? truncate(test.message, 40) : ''
      });
    });
    return testsTable.render();
  });

  const specsTable = new Table({
    title: 'Specs Summary',
    columns: [
      {name: 'SPEC', alignment: 'left'},
      {name: 'Tests', alignment: 'left'},
      {name: 'Passing', alignment: 'left'},
      {name: 'Platform', alignment: 'left'},
      {name: 'Failing', alignment: 'left', color: 'red'}
    ]
  });

  [...specsMap.values()].sort((a, b) => a.platformKey - b.platformKey).forEach(spec => specsTable.addRow({
    SPEC: statusIcons[spec.Status] + ' ' + printDuration(spec.Duration) + ' ' + spec.SPEC,
    Tests: spec.Tests,
    Passing: spec.Passing,
    Failing: spec.Failing,
    Platform: spec.platformKey
  }))

  return title + testsPrintableData.join('\n\n') + '\n' + specsTable.render();
};

export default async (credentials, session) => {
  console.log('sessionId', session.data);
  try {
    await new Promise((resolve, reject) => {
      getSessionDataLoop(credentials, session.data, new Date().getTime(), resolve, reject);
    });
  } catch (error) {
    console.error(error);
    process.exit(1)
  }
}
