import './common/on-exit';
import runCommand from './run';
import packCommand from './pack';
import uploadCommand from './upload';
import initCommand from './init';
import {
  DEFAULT_ARCHIVE_FILE_NAME,
  DEFAULT_ARCHIVE_FOLDER_TYPE,
  DEFAULT_ARCHIVE_IS_TEMP,
  DEFAULT_ARCHIVE_PATH,
  DEFAULT_CONFIG_PATH,
  DEFAULT_TESTS_SPECS_EXT
} from './common/defaults';
import { parseCustomFields } from './cmds/config-merge-util';
import { getConfigPath, getSecurityToken } from './common/env';

let configFilePath = getConfigPath();
const getConfigFile = () => {
  if (!configFilePath) {
    return {};
  }

  let config = {};
  try {
    config = require(configFilePath);
  } catch (error) {
    throw 'Config file not found: ' + error.message;
  }

  return config;
};

const perfectoCypress = {
  withConfigFile: (path=DEFAULT_CONFIG_PATH) => {
    configFilePath = path;
  },
  run: async ({credentials={}, tests, capabilities, reporting, env, nodeVersion}={}) => {
    const config = getConfigFile();
    const customFields = parseCustomFields(config?.reporting?.customFields, reporting?.customFields);

    const envSecurityToken = getSecurityToken();
    if (envSecurityToken) {
      credentials.securityToken = credentials?.securityToken || envSecurityToken;
    }

    const mergedParams = {
      ...config,
      credentials: {
        ...config?.credentials,
        ...credentials
      },
      env: {
        ...config.env,
        ...env
      },
      tests: {
        ...{specsExt: DEFAULT_TESTS_SPECS_EXT},
        ...config?.tests,
        ...tests
      },
      reporting: {
        ...config?.reporting,
        ...reporting,
        customFields,
      },
      nodeVersion: nodeVersion || config?.nodeVersion,
      capabilities: capabilities || config?.capabilities || []
    };

    return await runCommand(mergedParams);
  },
  pack: (testsRoot, ignoreRegexList, outPath = DEFAULT_ARCHIVE_PATH) => {
    const config = getConfigFile();
    const mergedParams = {
      testsRoot: testsRoot || config?.tests?.path,
      ignore: ignoreRegexList || config?.tests?.ignore,
      outPath: outPath || DEFAULT_ARCHIVE_PATH
    };

    return packCommand(
      mergedParams.testsRoot,
      mergedParams.ignore,
      mergedParams.outPath
    );
  },
  upload: async (
    archive = DEFAULT_ARCHIVE_PATH + DEFAULT_ARCHIVE_FILE_NAME,
    folderType = DEFAULT_ARCHIVE_FOLDER_TYPE,
    temporary = DEFAULT_ARCHIVE_IS_TEMP,
    {cloud, securityToken} = {}
  ) => {
    const config = getConfigFile();
    const credentials = {
      cloud: cloud || config?.credentials?.cloud,
      securityToken: securityToken || config?.credentials?.securityToken
    }

    return await uploadCommand(archive, folderType, temporary, credentials);
  },
  init: (testsRoot, cloud, projectName) => {
    initCommand(testsRoot, cloud, projectName);
  }
};

export default perfectoCypress;
