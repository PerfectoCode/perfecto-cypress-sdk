import { printDuration, objectToHash, getReportingExecutionLink } from './log-helpers';
import chalk from 'chalk';
import sessionHolder from './session-data';
import tasksLogger from './tasks-logger';
import { SessionState, TestResults } from '../common/consts';

let isTitlePrinted = false;

const renderTest = ({platform, test}) => {
  return `Test summary: ${test.status} | ${printDuration(test.duration)} | TestName: ${test.testName} | Platform: ${objectToHash(platform)}`;
}

const renderSpec = (spec) => {
  const failingText = spec.Failing ? chalk.red(`| Failing: ${spec.Failing}`) : '';
  return `${spec.Status} | ${printDuration(spec.Duration)} ${spec.SPEC} | Tests: ${spec.Tests} | Passing: ${spec.Passing}` + failingText + ' | Platform: ' + spec.platformHash;
};

const renderBlockedExecution = (blockedExecution) => {
  return `${blockedExecution.Status} | Platform:` + blockedExecution.platformHash;
}

const renderExecutionsSummery = (sessionData) => {
  return '\nExecutions Summery: executions: ' + sessionData.length + '| Passed: ' + sessionData.filter(d => d.result?.resultState === "SUCCESS").length + ' | Failed: ' + sessionData.filter(d => d.result?.resultState === "FAILED").length + ' | blocked: ' + sessionData.filter(d => d.result?.resultState === "BLOCKED").length;
}

export default (title, status, ended) => {
  if (!isTitlePrinted) {
    console.log(title);
    isTitlePrinted = true;
  }
  const executions = sessionHolder.getSessionData();
  if (executions && executions.length) {

    executions.forEach((execution) => {
      if (execution.executionState !== SessionState.DONE) {
        return;
      }

      if (tasksLogger.resolveAllTasks() && !execution.isPrinted) {
        execution.isPrinted = true;
        if (execution.tests){
          execution.tests.forEach((test) => {
            console.log(renderTest({test, platform: execution.platform}));
            if (test.status === TestResults.FAILED) {
              console.log('Error message: ' + test.message);
            }
          });
        }
        const resultMessage = execution.result?.resultMessage ? ' ' + execution.result?.resultMessage : '';
        const resultState = execution.result?.resultState ? ' ' + execution.result?.resultState : '';
        console.log('\nExecution summary: ' + objectToHash(execution.platform) + resultState + resultMessage + '\n' +
            getReportingExecutionLink(sessionHolder.getCloud(), execution.executionId) + '\n'
        );
      }
    });
  }
  if (ended) {
    const specList = sessionHolder.getSpecsSummary();
    if (specList.length > 0) {
      console.log('\nSpecs Summary:');
      specList.forEach(spec => console.log(renderSpec(spec)))
    }

    const blockedExecutions = sessionHolder.getBlockedExecutionsSummary();
    if (blockedExecutions.length > 0 ){
      console.log('\nPlease note, some of the executions has blocked status:');
      blockedExecutions.forEach(execution => console.log(renderBlockedExecution(execution)))
    }

    console.log(renderExecutionsSummery(sessionHolder.getSessionData()));
  }
};
