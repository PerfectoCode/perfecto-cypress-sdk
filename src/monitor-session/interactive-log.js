import sessionHolder from './session-data';
import { Table } from 'console-table-printer';
import logUpdate from 'log-update';
import * as logHelpers from './log-helpers';
import { StatusIcons, TestResults } from '../common/consts';
import { getReportingExecutionLink } from './log-helpers';

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

const getPrintableData = (title, status, ended) => {
  const testsPrintableData = sessionHolder.getSessionData().map((execution) => {
    const testsTable = new Table({
      title: execution.platformHash + '\n\t' + execution.result?.resultState + ' ' + (execution.result?.resultMessage || '') + '\n\t' +
        getReportingExecutionLink(sessionHolder.getCloud(), execution.executionId),
      columns: [
        {name: 'Test Name', alignment: 'left'},
        {name: 'Duration', alignment: 'left'},
        {name: 'Message', alignment: 'left', color: 'red'}
      ]
    });

    execution.tests.forEach(test => {
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
    Platform: spec.platformHash
  }))

  return title +
    testsPrintableData.join('\n\n') +
    (specsList.length ? ('\n' + specsTable.render()) : '') + '\n\n' +
    (!specsList.length || ended ? '' : '⏳  Waiting for tests results' + dotter.getDotes());
};

export default (title, status, ended) => {
  const logText = getPrintableData(title, status, ended);

  logUpdate(logText);

  if (ended) {
    logUpdate.done();
  }
};
