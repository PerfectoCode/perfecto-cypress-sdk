import chalk from 'chalk';
import axios from 'axios';
import { getBackendBaseUrl, getPerfectoHeaders } from '../common/api';
import * as logHelpers from './log-helpers';
import sessionHolder  from './session-data';
import monitorLogger from './monitor-logger';
import tasksLogger, {TASKS} from './tasks-logger';
import {ExecutionState, SessionState, ResultState} from '../common/consts';

const PULLING_INTERVAL = 3000;
let executionStartTime;
let sessionStatus;

const updateSessionStatus = (isEnded) => {
  if (sessionStatus === ExecutionState.EXECUTING || isEnded) {
    return tasksLogger.endTasks();
  }

  const sessionData = sessionHolder.getSessionData();
  const isExecuting = sessionData.find(execution => execution.executionState === ExecutionState.EXECUTING);
  if (isExecuting && sessionStatus === SessionState.INITIALIZING) {
    sessionStatus = ExecutionState.EXECUTING;
    return tasksLogger.endTask(TASKS.EXECUTION_INITIALIZE);
  }

  const isInitializing = sessionData.find(execution => execution.executionState === ExecutionState.INITIALIZING);
  if (isInitializing && sessionStatus  === ExecutionState.ALLOCATING) {
    sessionStatus = ExecutionState.INITIALIZING;
    return tasksLogger.endTask(TASKS.ALLOCATING_INSTANCES);
  }

  const isAllocating = sessionData.find(execution => execution.executionState === ExecutionState.ALLOCATING);
  if (isAllocating && !sessionStatus) {
    sessionStatus = ExecutionState.ALLOCATING;
    return tasksLogger.endTask(TASKS.SESSION_INITIALIZE);
  }

  return Promise.resolve();
};

const onExecutionEnd = (resolve, reject) => {
  const finalStatus = sessionHolder.getFinalStatus();

  const durationText = logHelpers.printDuration(new Date().getTime() - executionStartTime);
  const message = `Session ended with status: ${finalStatus}.` + `${chalk.gray(durationText)}`;

  if (finalStatus === ResultState.SUCCESS) {
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

      if (sessionData.executions && sessionData.executions.length) {
        sessionHolder.appendSessionData(sessionData);
      }

      await updateSessionStatus(sessionData.sessionState === SessionState.DONE);

      monitorLogger.logNewSessionData(sessionData);

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
  sessionHolder.setCloud(credentials.cloud);

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
    console.log(error?.response?.data ? error.response.data : error);
    process.exit(1);
  }
}
