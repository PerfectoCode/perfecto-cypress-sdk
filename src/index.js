import validator from 'argument-validator';
import runCommand from './run';
import packCommand from './pack';
import uploadCommand from './upload';
import {
  DEFAULT_CONFIG_PATH,
  DEFAULT_ARCHIVE_PATH,
  DEFAULT_ARCHIVE_FOLDER_TYPE,
  DEFAULT_ARCHIVE_IS_TEMP, DEFAULT_TESTS_SPECS_EXT, DEFAULT_ARCHIVE_FILE_NAME
} from './common/defaults';
import { parseCustomFields } from './cmds/config-merge-util';

let configFilePath = '';
const getConfigFile = () => {
  if (!configFilePath) {
    return {};
  }

  let config = {};
  try {
    config = require(configFilePath || DEFAULT_CONFIG_PATH);
  } catch (error) {
    throw 'Config file not found: ' + error.message;
  }

  return config;
};

const perfectoCypress = {
  setConfigPath: (path) => {
    configFilePath = path;
  },
  run: async ({credentials, tests, capabilities, reporting}) => {
    const config = getConfigFile();
    const customFields = parseCustomFields([...config?.reporting?.customFields, ...reporting?.customFields]);

    const mergedParams = {
      ...config,
      credentials: {
        ...config?.credentials,
        ...credentials
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
      capabilities: {
        ...config?.capabilities,
        ...capabilities
      }
    };

    validator.string(mergedParams?.cloud, 'cloud');
    validator.string(mergedParams?.securityToken, 'securityToken');
    validator.string(mergedParams.tests?.path || mergedParams.tests?.artifactKey, 'tests.path | tests.artifactKey');
    validator.string(mergedParams.tests?.specsExt, 'specsExt');
    validator.array(mergedParams.capabilities, 'capabilities');
    validator.objectOrEmpty(mergedParams.reporting, 'reporting');

    return await runCommand(mergedParams);
  },
  pack: async (pathRegex, ignoreRegexList, outPath = DEFAULT_ARCHIVE_PATH) => {
    const config = getConfigFile();
    const mergedParams = {
      pathRegex: pathRegex || config?.tests?.path,
      ignore: ignoreRegexList || config?.tests?.ignore,
      outPath: outPath || DEFAULT_ARCHIVE_PATH
    };

    validator.string(outPath, 'outPath');
    validator.string(mergedParams.pathRegex, 'pathRegex');
    validator.arrayOrEmpty(mergedParams.ignore, 'ignoreRegexList | tests.ignore');

    return await packCommand(
      mergedParams.pathRegex,
      mergedParams.ignore,
      mergedParams.outPath
    );
  },
  upload: async (
    archive = DEFAULT_ARCHIVE_PATH + DEFAULT_ARCHIVE_FILE_NAME,
    folderType = DEFAULT_ARCHIVE_FOLDER_TYPE,
    temporary = DEFAULT_ARCHIVE_IS_TEMP,
    {cloud, securityToken}
  ) => {
    const config = getConfigFile();
    const credentials = {
      cloud: cloud || config?.credentials?.cloud,
      securityToken: securityToken || config?.credentials?.securityToken
    }
    validator.string(credentials?.cloud, 'cloud');
    validator.string(credentials?.securityToken, 'securityToken');
    validator.string(archive, 'archive');
    validator.boolean(temporary, 'temporary');

    return await uploadCommand(archive, folderType, temporary, credentials);
  }
};

export default perfectoCypress;
