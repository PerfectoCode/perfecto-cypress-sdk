import { configOptions, credentialsOptions } from './options-builder'
import { mergeConfigWithParams } from './config-merge-util';
import uploadCommand from '../upload';
import { zipFileName } from '../common/consts';


export const command = 'upload';

export const desc = 'Upload tests zip archive to Perfecto cloud repository';

export const builder = {
  archivePath: {
    alias: 'p',
    describe: 'Path to tests zip file',
    default: './' + zipFileName
  },
  temporary: {
    alias: 't',
    describe: 'Upload tests archive as temp artifact',
    default: false,
    boolean: false
  },
  folderType: {
    alias: 'f',
    describe: 'Set the location of tests archive in the repository',
    default: 'PRIVATE',
    choices: ['PRIVATE', 'PUBLIC', 'GROUP']
  },
  ...credentialsOptions,
  ...configOptions
};

export const handler = async (argv) => {
  const configObject = mergeConfigWithParams(argv);

  await uploadCommand(argv.archivePath, argv.folderType, argv.temporary, configObject.credentials);
};
