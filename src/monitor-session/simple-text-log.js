import { printDuration, objectToHash, getReportingExecutionLink } from './log-helpers';
import chalk from 'chalk';
import sessionHolder from './session-data';
import { SessionState, TestResults } from '../common/consts';

let isTitlePrinted = false;

const renderTest = ({platform, test}) => {
  return `${test.status} | ${printDuration(test.duration)} | TestName: ${test.testName} | Platform: ${objectToHash(platform)}`;
}

const renderSpec = (spec) => {
  const failingText = spec.Failing ? chalk.red(`| Failing: ${spec.Failing}`) : '';
  return `${spec.Status} | ${printDuration(spec.Duration)} ${spec.SPEC} | Tests: ${spec.Tests} | Passing: ${spec.Passing} ` + failingText;
};

export default (title, status, sessionData, ended) => {
  if (!isTitlePrinted) {
    isTitlePrinted = true;
    console.log(title);
  }

  if (!sessionData.executions) {
    return;
  }

  sessionData.executions.forEach((execution) => {
    execution.tests.forEach((test) => {
      console.log(renderTest({test, platform: execution.platform}));

      if (test.status === TestResults.FAILED) {
        console.error(chalk.red(test.message));
      }
    });
    if (execution.executionState === SessionState.DONE) {
      console.log(
        objectToHash(execution.platformHash) + ' ' + execution.result?.resultState + ' ' + execution.result?.resultMessage + '\n' +
        getReportingExecutionLink(sessionHolder.getCloud(), execution.executionId)
      );
    }
  });

  if (ended) {
    console.log('\nSpecs Summary');
    sessionHolder.getSpecsSummary().forEach(spec => console.log(renderSpec(spec)))
  }
};
