import chalk from 'chalk';
import axios from 'axios';
import { getBackendBaseUrl, getPerfectoHeaders } from '../common/api';
import * as logHelpers from './log-helpers';
import sessionHolder  from './session-data';
import monitorLogger from './monitor-logger';
import tasksLogger from './tasks-logger';
import { SessionState, TestResults } from '../common/consts';

const PULLING_INTERVAL = 3000;
let executionStartTime;
let sessionStatus = SessionState.INITIALIZING;

const onExecutionStarts = () => {
  sessionStatus = SessionState.EXECUTING;
  return tasksLogger.endTasks();
};

const onNewTestsArrived = (sessionData) => {
  sessionHolder.appendSessionData(sessionData);
  monitorLogger.logNewSessionData(sessionData);
};

const onExecutionEnd = (resolve, reject) => {
  const finalStatus = sessionHolder.getFinalStatus();

  const durationText = logHelpers.printDuration(new Date().getTime() - executionStartTime);
  const message = `Session ended with status: ${finalStatus}.` + `${chalk.gray(durationText)}`;

  // TODO: (Elhay) NP-44722 print reporting link

  if (finalStatus === TestResults.PASSED) {
    resolve(chalk.green(message));
  } else {
    reject(chalk.red(message));
  }
};

const getSessionDataLoop = (credentials, sessionId, resolve, reject) => {
  axios.get(getBackendBaseUrl(credentials.cloud) + '/sessions/' + sessionId, {
    headers: getPerfectoHeaders(credentials.cloud, credentials.securityToken)
  })
    .then(async (res) => {
      const sessionData = res.data;

      if (sessionStatus === SessionState.INITIALIZING && sessionData.sessionState !== SessionState.INITIALIZING) {
        await onExecutionStarts();
        monitorLogger.logNewSessionData(sessionData);
      }

      if (sessionData.tests.length) {
        onNewTestsArrived(sessionData);
      }

      if (sessionData.sessionState !== SessionState.DONE) {
        setTimeout(
          () => getSessionDataLoop(credentials, sessionId, resolve, reject),
          PULLING_INTERVAL
        );
      } else {
        onExecutionEnd(resolve, reject);
      }
    })
    .catch(reject);
}

export default async (credentials, session) => {
  monitorLogger.logNewSessionData({
    sessionState: SessionState.INITIALIZING,
    sessionId: session.data
  });
  tasksLogger.run();

  executionStartTime = new Date().getTime();

  try {
    const sessionEndMessage = await new Promise((resolve, reject) => {
      getSessionDataLoop(credentials, session.data, resolve, reject);
    });
    console.log(sessionEndMessage);
    process.exit(0);
  } catch (error) {
    console.error(error?.response?.data ? error.response.data : error);
    process.exit(1);
  }
}
