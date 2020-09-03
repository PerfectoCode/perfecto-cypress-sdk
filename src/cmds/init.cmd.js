import yargsInteractive from 'yargs-interactive'
import initCommand from '../init';
import { testsOptions } from './options-builder';

export const command = 'init';

export const desc = 'init Perfecto and Cypress configuration files';

export const builder = {
  prompt: { default: true, hidden: true, boolean: true },
  'tests.path': {...testsOptions['tests.path']}
};

const options = {
  cypressProjectId: { type: 'input', describe: 'Enter Cypress projectId, see: https://docs.cypress.io/guides/dashboard/projects.html#Identification' },
  cloud: { type: 'input',describe: 'Enter your Perfecto cloud name' },
  projectName: { type: 'input', describe: 'Enter a project name for your test root folder (only if there is no package.json in this folder)' }
};

export const handler = async (argv) => {
  const result = await yargsInteractive().interactive({...options, interactive: { default: argv.prompt }});

  initCommand(argv?.tests?.path, result.cypressProjectId, result.cloud, result.projectName);
};
