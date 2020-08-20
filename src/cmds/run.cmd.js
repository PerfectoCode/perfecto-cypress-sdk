import fs from 'fs';
import perfectoSdk from '../index';

const reportingDocLink = 'https://developers.perfectomobile.com/display/PD/Download+the+Reporting+SDK'
const CONFIG_DEFAULT_PATH = './perfecto-config.json';
const cypressDocLink = '' // TODO: (Elhay) Add a documentation link

const reportingGroupName = 'Reporting options (will override config file) ' + reportingDocLink;
const credentialsGroupName = 'Credentials options (will override config file)';
const testGroupName = 'Test options (will override config file)';

const configFileOverrides = {
  // Credentials
  'credentials.cloud': {type: 'string', describe: 'Cloud name', group: credentialsGroupName},
  'credentials.securityToken': {type: 'string', describe: 'Offline token', group: credentialsGroupName},

  // Tests
  'tests.artifactKey': {type: 'string', describe: 'Repository artifact key', group: testGroupName},
  'tests.path': {type: 'string', describe: 'Root path for test to pack', group: testGroupName},
  'tests.ignore': {type: 'string', describe: 'ignore files list', array: true, group: testGroupName},
  'tests.specs': {type: 'string', describe: 'specs list', array: true, group: testGroupName},

  // reporting
  'reporting.jobName': {type: 'number', describe: 'reporting job name', group: reportingGroupName},
  'reporting.jobNumber': {type: 'number', describe: 'reporting job number', group: reportingGroupName},
  'reporting.branch': {type: 'string', describe: 'reporting branch', group: reportingGroupName},
  'reporting.projectName': {type: 'string', describe: 'reporting project name', group: reportingGroupName},
  'reporting.projectVersion': {type: 'string', describe: 'reporting project version', group: reportingGroupName},
  'reporting.author': {type: 'string', describe: 'reporting author', group: reportingGroupName},
  'reporting.tags': {describe: 'reporting tags, example: tag1 tag2', array: true, group: reportingGroupName},
  'reporting.customFields': {
    describe: 'reporting custom fields, example: key1,value1 key2,value2',
    array: true,
    group: reportingGroupName
  }
};

const parseCustomFields = (fieldsArray, configValues) => {
  if (!fieldsArray?.length) return ;
  return fieldsArray.reduce((acc, item) => {
    if (typeof item !== 'string') {
      return acc;
    }

    const [key, value] = item?.split(',');

    if (!key || !value) {
      throw 'customField should be a string with comma: key,value';
    }
    acc[key] = value;
    return acc;
  }, {...configValues});
};

export const command = 'run';

export const desc = 'Run Cypress tests on Perfecto cloud';

export const builder = {
  ...configFileOverrides,
  config: {
    config: true,
    describe: 'Path to config file, see documentation: ' + cypressDocLink,
    default: process.env['PERFECTO_CONFIG'] || CONFIG_DEFAULT_PATH,
    // global: true,
    coerce: (configPath) => {
      return JSON.parse(fs.readFileSync(configPath, 'utf-8'))
    }
  }
};

export const handler = (argv) => {
  perfectoSdk({
    ...argv.config,
    reporting: {
      ...argv?.reporting,
      customFields: {
        ...parseCustomFields(argv?.reporting?.customFields, argv.config?.reporting?.customFields)
      }
    },
    tests: {
      ...argv.config?.tests,
      ...argv?.tests
    },
    credentials: {
      ...argv.config?.credentials,
      ...argv?.credentials
    }
  })
};
