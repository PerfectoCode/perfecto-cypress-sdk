import tty from 'tty';
import interactiveLogger from './interactive-log'
import simpleTextLogger from './simple-text-log'
import { SessionState } from '../common/consts';

const isTTY = tty.isatty(process.stdout.fd);

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

    if (isTTY) {
      interactiveLogger(title, status, sessionId, isEnded);
    } else {
      simpleTextLogger(title, status, sessionData, isEnded);
    }
  }
};

export default monitorLogger;
