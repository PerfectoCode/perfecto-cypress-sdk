import { objectToHash } from './log-helpers';
import { ExecutionResults, SessionState, TestResults } from '../common/consts';

const sessionDataMap = new Map();
const specsMap = new Map();
let finalStatus = TestResults.PASSED;

const appendSpecsData = (executionId, platformHash, test) => {
  const specKey = executionId + '-' + test.specFile;
  const specData = specsMap.get(specKey);
  if (!specData) {
    specsMap.set(specKey, {
      platformHash,
      executionId,
      SPEC: test.specFile,
      Tests: 1,
      Status: test.status,
      Duration: test.duration,
      Passing: test.status === TestResults.PASSED ? 1 : 0,
      Failing: test.status !== TestResults.PASSED ? 1 : 0,
      testName: test.testName
    });
  } else {
    if (test.testName !== specData.testName){
      specData.Tests ++;
      specData.Duration += test.duration;

      if (test.status === TestResults.PASSED) {
        specData.Passing ++;
      } else {
        specData.Failing ++;
        specData.Status = test.status;
      }
    }
  }
};
let sessionCloudName = '';

const sessionHolder = {
  getSessionData: () => [...sessionDataMap.values()],
  getSpecsSummary:  () => [...specsMap.values()].sort((a, b) => a.platformHash - b.platformHash),
  getFinalStatus: () => finalStatus,

  getCloud: () => sessionCloudName,
  setCloud: (cloudName) => {
    sessionCloudName = cloudName;
  },

  appendSessionData: (sessionData) => {
    sessionData.executions.forEach(execution => {
      const platformHash = objectToHash(execution.platform);

      if (!sessionDataMap.get(execution.executionId)) {
        sessionDataMap.set(execution.executionId, {
          platformHash: platformHash,
          executionId: execution.executionId,
          platform: execution.platform,
          executionState: execution.executionState,
          isPrinted: false,
          result: execution.result,
          tests: execution.tests
        });
      } else {
        const tests = sessionDataMap.get(execution.executionId).tests || [];
        const executionData = {
          ...sessionDataMap.get(execution.executionId),
          ...execution,
          tests: [...tests, ...execution.tests]
        };
        sessionDataMap.set(execution.executionId, executionData);
      }

      const resultState = execution.result?.resultState;
      if (execution.executionState === SessionState.DONE && resultState && resultState !== ExecutionResults.SUCCESS) {
        finalStatus = ExecutionResults.FAILED;
      }
      execution.tests?.forEach(test => {
        if (test.status === ExecutionResults.FAILED) {
          finalStatus = ExecutionResults.FAILED;
        }
      });
      sessionDataMap.get(execution.executionId).tests.forEach(test => appendSpecsData(execution.executionId, platformHash, test));
    });
  }
};
export default sessionHolder;
