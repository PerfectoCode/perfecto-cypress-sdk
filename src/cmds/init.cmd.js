import yargsInteractive from 'yargs-interactive'
import initCommand from '../init';
import { testsOptions, credentialsOptions } from './options-builder';

export const command = 'init';

export const desc = 'init Perfecto and Cypress configuration files';

export const builder = {
  prompt: { default: true, hidden: true, boolean: true },
  'tests.path': { ...testsOptions['tests.path']},
  ...credentialsOptions,
  skip: { type: 'boolean', default: false, describe: 'Skip interactive questions' },
};

const getInitOptions = (argv) => {
  return {
    cloud: { type: 'input', default: argv.credentials?.cloud, describe: 'Enter Perfecto cloud name' },
    securityToken : {type: 'input', default: argv.credentials?.securityToken, describe: 'Enter your Perfecto security token'},
    testsPath: { type: 'input', default: argv.tests?.path || './', describe: 'Enter path for cypress folder', ...argv.tests?.path ? {} : {prompt: 'always'} }
  };
}

export const handler = async (argv) => {
  if (argv.skip) {
    initCommand(argv.credentials?.cloud, argv.credentials?.securityToken, argv.tests?.path);
  } else {
    const options = getInitOptions(argv);
    const result = await yargsInteractive().interactive({ ...options, interactive: { default: argv.prompt } });
    initCommand(result.cloud, result.securityToken, result.testsPath);
  }
};
