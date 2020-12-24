import { configOptions, credentialsOptions, reportingOptions, testsOptions } from './options-builder'
import { mergeConfigWithParams } from './config-merge-util';
import runCommand from '../run';


export const command = 'run';

export const desc = 'Run Cypress tests on Perfecto cloud';

export const builder = {
  ...credentialsOptions,
  ...testsOptions,
  ...reportingOptions,
  nodeVersion: {alias: 'n', type: 'string', describe: 'Specify Node.js version for Cypress execution environment'},
  env: {alias: 'e', type: 'object', usage: '--env.CYPRESS_BASE_URL=https://google.com', describe: 'environment variables to attach to `cypress run` command --env.CYPRESS_BASE_URL=https://google.com'},
  ...configOptions
};

export const handler = async (argv) => {
  const configObject = mergeConfigWithParams(argv);

  await runCommand(configObject)
};
