import { globalIgnorePatterns } from './consts';

export const getIgnoredFiles = (ignore=[]) => {
  return [...ignore, ...globalIgnorePatterns];
};
