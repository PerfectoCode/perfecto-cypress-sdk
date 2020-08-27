import validator from 'argument-validator';
import { REPOSITORY_FOLDER_TYPES } from './defaults';

export const validatePackOptions = (pathRegex, ignore, outPath) => {
  validator.string(pathRegex, 'pathRegex | tests.path');
  validator.arrayOrEmpty(ignore, 'ignoreRegexList | tests.ignore');
  validator.string(outPath, 'outPath');
}

export const validateRunOptions = (mergedParams) => {
  validator.string(mergedParams?.credentials?.cloud, 'cloud');
  validator.string(mergedParams?.credentials?.securityToken, 'securityToken');
  validator.string(mergedParams.tests?.path || mergedParams.tests?.artifactKey, 'tests.path | tests.artifactKey');
  validator.string(mergedParams.tests?.specsExt, 'specsExt');
  validator.array(mergedParams.capabilities, 'capabilities');
  validator.objectOrEmpty(mergedParams.reporting, 'reporting');
};

export const validateUploadOptions = (archive, folderType, temporary, credentials) => {
  validator.string(credentials?.cloud, 'cloud');
  validator.string(credentials?.securityToken, 'securityToken');
  validator.string(archive, 'archive');
  validator.boolean(temporary, 'temporary');

  if  (folderType && !REPOSITORY_FOLDER_TYPES.includes(folderType)) {
    throw `Invalid string value: ${folderType}\nArgument Name: folderType.\nit has to be one of ${REPOSITORY_FOLDER_TYPES}`;
  }
};
