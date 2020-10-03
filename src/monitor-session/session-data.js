import { objectToHash } from './log-helpers';
import { TestResults } from '../common/consts';

const sessionDataMap = new Map();
const specsMap = new Map();
let finalStatus = TestResults.PASSED;

const appendSpecsData = (platformKey, test) => {
  const specKey = platformKey + '-' + test.specFile;
  const specData = specsMap.get(specKey);
  if (!specData) {
    specsMap.set(specKey, {
      platformKey: platformKey,
      SPEC: test.specFile,
      Tests: 1,
      Status: test.status,
      Duration: test.duration,
      Passing: test.status === TestResults.PASSED ? 1 : 0,
      Failing: test.status !== TestResults.PASSED ? 1 : 0
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

const sessionHolder = {
  getSessionData: () => [...sessionDataMap.values()],
  getSpecsSummary:  () => [...specsMap.values()].sort((a, b) => a.platformKey - b.platformKey),
  getFinalStatus: () => finalStatus,

  appendSessionData: (sessionData) => {
    sessionData.tests.forEach(test => {
      const platformHash = objectToHash(test.platform);

      if (!sessionDataMap.get(platformHash)) {
        sessionDataMap.set(platformHash, {
          platformHash: platformHash,
          platform: test.platform,
          tests: [test.testData]
        });
      } else {
        const platformData = sessionDataMap.get(platformHash);
        platformData.tests.push(test.testData)
      }

      if (test.testData.status === TestResults.FAILED) {
        finalStatus = test.testData.status;
      }
      sessionDataMap.get(platformHash).tests.forEach(test => appendSpecsData(platformHash, test));
    });
  }
};
export default sessionHolder;
