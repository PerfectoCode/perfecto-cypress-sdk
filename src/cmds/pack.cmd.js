import packCommand from '../pack';
import { configOptions, testsOptions } from './options-builder';
import { mergeConfigWithParams } from './config-merge-util';
import { DEFAULT_ARCHIVE_PATH } from '../common/defaults';

export const command = 'pack';

export const desc = 'Zip tests files according to configurations';

export const builder = {
  ...testsOptions,
  out: {
    describe: 'Output path for zip file',
    default: DEFAULT_ARCHIVE_PATH
  },
  ...configOptions
};

export const handler = async (argv) => {
  const configObject = mergeConfigWithParams(argv);
  await packCommand(configObject.tests.path, configObject.tests.ignore, argv.out);
};
