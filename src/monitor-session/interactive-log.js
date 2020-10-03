import sessionHolder from './session-data';
import { Table } from 'console-table-printer';
import logUpdate from 'log-update';
import * as logHelpers from './log-helpers';
import { StatusIcons, TestResults } from '../common/consts';

const dotter = {
  dotes: ['.', '.'],
  getDotes: () => {
    if (dotter.dotes.length >= 10) {
      dotter.dotes = ['.', '.']
    }
    dotter.dotes.push('.');
    return dotter.dotes.join('');
  }
}

const getPrintableData = (title, status, sessionId, ended) => {
  const testsPrintableData = sessionHolder.getSessionData().map((platformData) => {
    const testsTable = new Table({
      title: platformData.platformHash,
      columns: [
        {name: 'Test Name', alignment: 'left'},
        {name: 'Duration', alignment: 'left'},
        {name: 'Message', alignment: 'left', color: 'red'}
      ]
    });

    platformData.tests.forEach(test => {
      testsTable.addRow({
        'Test Name': StatusIcons[test.status] + ' ' + test.testName,
        Duration: logHelpers.printDuration(test.duration),
        Message: test.status === TestResults.FAILED ? logHelpers.truncate(test.message, 40) : ''
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

  const specsList = sessionHolder.getSpecsSummary();
  specsList.forEach(spec => specsTable.addRow({
    SPEC: StatusIcons[spec.Status] + ' ' + logHelpers.printDuration(spec.Duration) + ' ' + spec.SPEC,
    Tests: spec.Tests,
    Passing: spec.Passing,
    Failing: spec.Failing || '',
    Platform: spec.platformKey
  }))

  return title +
    testsPrintableData.join('\n\n') +
    (specsList.length ? ('\n' + specsTable.render()) : '') + '\n\n' +
    (!specsList.length || ended ? '' : '⏳  Waiting for tests results' + dotter.getDotes());
};

export default (title, status, sessionId, ended) => {
  const logText = getPrintableData(title, status, sessionId, ended);

  logUpdate(logText);

  if (ended) {
    logUpdate.done();
  }
};
