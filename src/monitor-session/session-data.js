import { objectToHash } from './log-helpers';
import { SessionState, TestResults, ResultState } from '../common/consts.js';

const sessionDataMap = new Map();
const specsMap = new Map();
let finalStatus = ResultState.PASSED;

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
    });
  } else {
      specData.Tests ++;
      specData.Duration += test.duration;

      if (test.status === TestResults.PASSED) {
        specData.Passing ++;
      } else {
        specData.Failing ++;
        specData.Status = test.status;
      }
  }
};

const getBlockedExecutionData = () => {
  let blockedExecutions = [];
  sessionDataMap.forEach(sessionData => {
    if (sessionData.result?.resultState === "BLOCKED"){
      blockedExecutions.push({
        executionId: sessionData.executionId,
        platformHash: sessionData.platformHash,
        Status: "BLOCKED"
      });
    }
  });
  return blockedExecutions;
}

let sessionCloudName = '';

const sessionHolder = {
  getSessionData: () => [...sessionDataMap.values()],
  getSpecsSummary:  () => [...specsMap.values()].sort((a, b) => a.platformHash - b.platformHash),
  getBlockedExecutionsSummary:  () => [...getBlockedExecutionData()].sort((a, b) => a.platformHash - b.platformHash),
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
          ...execution,
          platformHash: platformHash,
          isPrinted: false,
        });
      } else {
        const executionData = {
          ...sessionDataMap.get(execution.executionId),
          ...execution,
        };
        sessionDataMap.set(execution.executionId, executionData);
      }

      if (execution.executionState === SessionState.DONE && sessionData && sessionData.resultState){
        finalStatus = sessionData.resultState;
        sessionDataMap.get(execution.executionId).tests.forEach(test => appendSpecsData(execution.executionId, platformHash, test));
      }
    });
  }
};
export default sessionHolder;
