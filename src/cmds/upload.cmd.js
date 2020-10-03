import { configOptions, credentialsOptions } from './options-builder'
import { mergeConfigWithParams } from './config-merge-util';
import uploadCommand from '../upload';
import {
  DEFAULT_ARCHIVE_PATH,
  DEFAULT_ARCHIVE_FILE_NAME,
  DEFAULT_ARCHIVE_FOLDER_TYPE,
  DEFAULT_ARCHIVE_IS_TEMP
} from '../common/defaults';
import { REPOSITORY_FOLDER_TYPES } from '../common/consts';


export const command = 'upload';

export const desc = 'Upload tests zip archive to Perfecto cloud repository';

export const builder = {
  archivePath: {
    alias: 'p',
    describe: 'Path to tests zip file',
    default: DEFAULT_ARCHIVE_PATH + DEFAULT_ARCHIVE_FILE_NAME
  },
  temporary: {
    alias: 't',
    describe: 'Upload tests archive as temp artifact',
    default: DEFAULT_ARCHIVE_IS_TEMP,
    boolean: true
  },
  folderType: {
    alias: 'f',
    describe: 'Set the location of tests archive in the repository',
    default: DEFAULT_ARCHIVE_FOLDER_TYPE,
    choices: REPOSITORY_FOLDER_TYPES
  },
  ...credentialsOptions,
  ...configOptions
};

export const handler = async (argv) => {
  const configObject = mergeConfigWithParams(argv);

  await uploadCommand(argv.archivePath, argv.folderType, argv.temporary, configObject.credentials);
};
