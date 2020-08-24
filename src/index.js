import runCommand from './run';
import packCommand from './pack';
import uploadCommand from './upload';
import { CONFIG_DEFAULT_PATH, DEFAULT_ARCHIVE_PATH } from './common/consts';
import { parseCustomFields } from './cmds/config-merge-util';

let configFilePath = '';
const getConfigFile = () => {
  if (!configFilePath) {
    return {};
  }

  let config = {};
  try {
    config = require(configFilePath || CONFIG_DEFAULT_PATH);
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

    return await runCommand({
      ...config,
      credentials: {
        ...config?.credentials,
        ...credentials
      },
      tests: {
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
    });
  },
  pack: async (pathRegex, ignoreRegexList, outPath) => {
    const config = getConfigFile();

    return await packCommand(
      pathRegex || config?.tests?.path,
      ignoreRegexList || config?.tests?.ignore,
      outPath || DEFAULT_ARCHIVE_PATH
    );
  },
  upload: async (archive, folderType, temporary, {cloud, securityToken}) => {
    const config = getConfigFile();
    const credentials = {
      cloud: cloud || config?.credentials?.cloud,
      securityToken: securityToken || config?.credentials?.securityToken
    }

    return await uploadCommand(archive, folderType, temporary, credentials);
  }
};

export default perfectoCypress;
