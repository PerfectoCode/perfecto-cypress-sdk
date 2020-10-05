import validator from 'argument-validator';
import { REPOSITORY_FOLDER_TYPES, SUPPORTED_FRAMEWORKS } from './consts';

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
  validator.string(mergedParams.tests?.path, 'tests.path');
  validator.string(mergedParams.tests?.path || mergedParams.tests?.artifactKey, 'tests.artifactKey');

  validator.objectOrEmpty(mergedParams.env || {}, 'env');
  validator.string(mergedParams.tests?.specsExt, 'tests.specsExt');
  validator.array(mergedParams.capabilities, 'capabilities');
  validator.objectOrEmpty(mergedParams.reporting || {}, 'reporting');
  validator.stringOrEmpty(mergedParams.nodeVersion || '', 'nodeVersion');

  if  (!Object.values(SUPPORTED_FRAMEWORKS).includes(mergedParams.framework)) {
    throw new Error(`Invalid string value: ${mergedParams.framework}\nArgument Name: framework.\nit has to be one of ${Object.values(SUPPORTED_FRAMEWORKS)}`);
  }
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

export const validateInitOptions = (testsRoot, cloud='', projectName='') => {
  validator.string(testsRoot, 'testsRoot');
  validator.stringOrEmpty(cloud, 'cloud');
  validator.stringOrEmpty(projectName, 'projectName');
};
