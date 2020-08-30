import validator from 'argument-validator';
import { REPOSITORY_FOLDER_TYPES } from './defaults';

const validateCredentials = (credentials) => {
  validator.string(credentials?.cloud, 'credentials.cloud');
  validator.string(credentials?.securityToken, 'credentials.securityToken');
};

export const validatePackOptions = (pathRegex, ignore, outPath) => {
  validator.string(pathRegex, 'pathRegex | tests.path');
  validator.arrayOrEmpty(ignore, 'ignoreRegexList | tests.ignore');
  validator.string(outPath, 'outPath');
}

export const validateRunOptions = (mergedParams) => {
  validateCredentials(mergedParams.credentials);
  validator.string(mergedParams.tests?.path || mergedParams.tests?.artifactKey, 'tests.path | tests.artifactKey');
  validator.string(mergedParams.tests?.specsExt, 'tests.specsExt');
  validator.array(mergedParams.capabilities, 'capabilities');
  validator.objectOrEmpty(mergedParams.reporting || {}, 'reporting');
};

export const validateUploadOptions = (archive, folderType, temporary, credentials) => {
  validateCredentials(credentials);
  validator.string(archive, 'archive');
  validator.string(folderType, 'folderType');
  validator.boolean(temporary, 'temporary');

  if  (folderType && !REPOSITORY_FOLDER_TYPES.includes(folderType)) {
    throw new Error(`Invalid string value: ${folderType}\nArgument Name: folderType.\nit has to be one of ${REPOSITORY_FOLDER_TYPES}`);
  }
};
