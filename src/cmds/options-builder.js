import fs from "fs";
import { DEFAULT_CONFIG_PATH, DEFAULT_TESTS_SPECS_EXT } from '../common/defaults';
import { getConfigPath, getSecurityToken } from '../common/env';

const reportingDocLink = 'https://developers.perfectomobile.com/display/PD/Download+the+Reporting+SDK'
const cypressDocLink = '' // TODO: (Elhay) Add a documentation link

const reportingGroupName = 'Reporting options (will override config file) ' + reportingDocLink;
const credentialsGroupName = 'Credentials options (will override config file)';
const testGroupName = 'Test options (will override config file)';

export const credentialsOptions = {
  'credentials.cloud': {alias: 'cloud', type: 'string', describe: 'Cloud name', group: credentialsGroupName},
  'credentials.securityToken': {alias: 'token', type: 'string', describe: 'Offline token', default: getSecurityToken(), group: credentialsGroupName}
};

export const testsOptions = {
  'tests.artifactKey': {alias: 'ta', type: 'string', describe: 'Repository artifact key', group: testGroupName},
  'tests.path': {alias: 'tp', type: 'string', describe: 'Root path for test to pack', group: testGroupName},
  'tests.ignore': {alias: 'ti', describe: 'ignore files list', array: true, group: testGroupName},
  'tests.specsExt': {alias: 'ts', default: DEFAULT_TESTS_SPECS_EXT, describe: 'specs files extension', type: 'string', group: testGroupName}
};

export const reportingOptions = {
  'reporting.job.name': {alias: 'rjn', type: 'string', describe: 'reporting job name', group: reportingGroupName},
  'reporting.job.number': {alias: 'rjNum', type: 'number', describe: 'reporting job number', group: reportingGroupName},
  'reporting.job.branch': {alias: 'rb', type: 'string', describe: 'reporting branch', group: reportingGroupName},
  'reporting.project.name': {alias: 'rpn', type: 'string', describe: 'reporting project name', group: reportingGroupName},
  'reporting.project.version': {alias: 'rpv', type: 'string', describe: 'reporting project version', group: reportingGroupName},
  'reporting.author': {alias: 'ra', type: 'string', describe: 'reporting author', group: reportingGroupName},
  'reporting.tags': {alias: 'rt', describe: 'reporting tags, example: tag1 tag2', array: true, group: reportingGroupName},
  'reporting.customFields': {
    alias: 'rcf',
    describe: 'reporting custom fields, example: key1,value1 key2,value2',
    array: true,
    group: reportingGroupName
  }
};

export const configOptions = {
  config: {
    alias: 'c',
    config: true,
    describe: 'Path to config file, see documentation: ' + cypressDocLink,
    default: getConfigPath() || DEFAULT_CONFIG_PATH,
    // global: true,
    coerce: (configPath) => {
      return JSON.parse(fs.readFileSync(configPath, 'utf-8'))
    }
  }
};
