// import interactiveLogger from './interactive-log'
import simpleTextLogger from './simple-text-log'
import { SessionState } from '../common/consts';

// const isTTY = process.stdout.isTTY;

const getPrintTitle = (status, sessionId) => {
  return `
++++++++++++++++++++++++++++++++++++
  Session status: ${status} - ${sessionId}
++++++++++++++++++++++++++++++++++++

  `;
}

const monitorLogger  = {
  logNewSessionData: (sessionData) => {
    const status = sessionData.sessionState;
    const isEnded = status === SessionState.DONE;
    const sessionId = sessionData.sessionId;
    const title = getPrintTitle(status, sessionId);

    simpleTextLogger(title, status, isEnded);
    // if (isTTY) {
    //   interactiveLogger(title, status, isEnded);
    // } else {
    // }
  }
};

export default monitorLogger;
