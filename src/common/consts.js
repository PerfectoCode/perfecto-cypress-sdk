export const SUPPORTED_FRAMEWORKS = {
  CYPRESS: 'CYPRESS'
};
export const TestResults = {
  PASSED: 'PASSED',
  FAILED: 'FAILED'
};

export const ExecutionResults = {
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  ABORTED: 'ABORTED'
};
export const SessionState = {
  INITIALIZING: 'INITIALIZING',
  EXECUTING: 'EXECUTING',
  DONE: 'DONE'
};

export const ExecutionState = {
  ALLOCATING: 'ALLOCATING',
  INITIALIZING: 'INITIALIZING',
  EXECUTING: 'EXECUTING',
  POST_EXECUTING: 'POST_EXECUTING',
  DONE: 'DONE'
};
export const StatusIcons = {
  PASSED: '✔︎',
  FAILED: '✖'
};
export const REPOSITORY_FOLDER_TYPES = ['PRIVATE', 'PUBLIC', 'GROUP']

export const globalIgnorePatterns = [
  '**/node_modules/**',
  '**/perfecto-cypress.zip'
];
