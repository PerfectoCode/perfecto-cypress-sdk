import proxyquire from 'proxyquire';
import yargs from 'yargs';
import sinon from 'sinon';
import { expect } from 'chai';
import { objectToCliOptions } from '../util/cli-util';
import {
  DEFAULT_ARCHIVE_FILE_NAME,
  DEFAULT_ARCHIVE_FOLDER_TYPE,
  DEFAULT_ARCHIVE_IS_TEMP,
  DEFAULT_ARCHIVE_PATH
} from '../../src/common/defaults';

const mockPackCommand = (stub) => {
  return proxyquire('../../src/cmds/upload.cmd', {'../upload': {default: stub}});
};

const triggerUploadCommandMock = async (options) => {
  const packCommandStub = sinon.stub();
  const packCmdModule = mockPackCommand(packCommandStub);

  const command = yargs.parserConfiguration({'camel-case-expansion': false}).command(packCmdModule,);

  try {
    await command.parse('upload' + objectToCliOptions(options),);
  } catch (error) {
    return error;
  }
  return packCommandStub;
};

describe('Upload - cmd', () => {
  describe('default parameters', () => {
    it('should have default value for archivePath, folderType, temporary', async () => {
      const options = {
        config: 'test/resources/perfecto-config.json',
        'credentials.cloud': 'foo',
        'credentials.securityToken': 'bar'
      };
      const packCommandStub = await triggerUploadCommandMock(options);

      expect(packCommandStub).to.have.been.calledWithExactly(
        DEFAULT_ARCHIVE_PATH + DEFAULT_ARCHIVE_FILE_NAME,
        DEFAULT_ARCHIVE_FOLDER_TYPE,
        DEFAULT_ARCHIVE_IS_TEMP,
        {
          cloud: options['credentials.cloud'],
          securityToken: options['credentials.securityToken']
        }
      );
    });
  });

  describe('with config file', () => {
    it('should get required parameters from config file', async () => {
      const options = {
        config: 'test/resources/perfecto-config.json'
      };
      const packCommandStub = await triggerUploadCommandMock(options);

      expect(packCommandStub).to.have.been.calledWithExactly(
        DEFAULT_ARCHIVE_PATH + DEFAULT_ARCHIVE_FILE_NAME,
        DEFAULT_ARCHIVE_FOLDER_TYPE,
        DEFAULT_ARCHIVE_IS_TEMP,
        {
          cloud: 'cloud-name',
          securityToken: '*****'
        }
      );
    });

    it('params should override config file', async () => {
      const options = {
        config: 'test/resources/perfecto-config.json',
        archivePath: 'archive-test/',
        folderType: 'PUBLIC',
        temporary: false,
        'credentials.cloud': 'foo',
        'credentials.securityToken': 'bar'
      };
      const packCommandStub = await triggerUploadCommandMock(options);

      expect(packCommandStub).to.have.been.calledWithExactly(
        'archive-test/',
        'PUBLIC',
        false,
        {
          cloud: options['credentials.cloud'],
          securityToken: options['credentials.securityToken']
        }
      );
    });
  });

  describe('without config file', () => {
    it('should pass parameters to packCommand', async () => {
      const options = {
        config: 'test/resources/empty-perfecto-config.json',
        archivePath: 'archive-test/',
        folderType: 'PUBLIC',
        temporary: false,
        'credentials.cloud': 'foo',
        'credentials.securityToken': 'bar'
      };
      const packCommandStub = await triggerUploadCommandMock(options);

      expect(packCommandStub).to.have.been.calledWithExactly(
        'archive-test/',
        'PUBLIC',
        false,
        {
          cloud: options['credentials.cloud'],
          securityToken: options['credentials.securityToken']
        }
      );
    });
  });
});
