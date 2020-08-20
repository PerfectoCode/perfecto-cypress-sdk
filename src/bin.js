#!/usr/bin/env node
import fs from 'fs';
import yargs from 'yargs';
import perfectoSdk from './index';

const CONFIG_DEFAULT_PATH = './perfecto-config.json';
const cypressDocLink = '' // TODO: (Elhay) Add a documentation link
const reportingDocLink = 'https://developers.perfectomobile.com/display/PD/Download+the+Reporting+SDK'

const reportingGroupName = 'Reporting options (will override config file) ' + reportingDocLink;
const configFileOverrides = {
  'reporting.jobName': {type: 'number', describe: 'reporting job name', group: reportingGroupName},
  'reporting.jobNumber': {type: 'number', describe: 'reporting job number', group: reportingGroupName},
  'reporting.branch': {type: 'string', describe: 'reporting branch', group: reportingGroupName},
  'reporting.projectName': {type: 'string', describe: 'reporting project name', group: reportingGroupName},
  'reporting.projectVersion': {type: 'string', describe: 'reporting project version', group: reportingGroupName},
  'reporting.author': {type: 'string', describe: 'reporting author', group: reportingGroupName},
  'reporting.tags': {describe: 'reporting tags, example: tag1 tag2', array: true, group: reportingGroupName},
  'reporting.customFields': {describe: 'reporting custom fields, example: key1,value1 key2,value2', array: true, group: reportingGroupName}
};

// noinspection BadExpressionStatementJS
yargs
  .demandCommand(1, 'You need at least one command before moving on')
  // .middleware([getConfigPath], true)
  .command('run', 'Run Cypress tests on Perfecto cloud', {}, (argv) => perfectoSdk(argv))
  .default('config', process.env['PERFECTO_CONFIG'] || CONFIG_DEFAULT_PATH)
  .config('config', 'Path to config file, see documentation: ' + cypressDocLink, (configPath) => {
    return JSON.parse(fs.readFileSync(configPath, 'utf-8'))
  })
  .options(configFileOverrides)
  .version()
  .help()
  .argv;
