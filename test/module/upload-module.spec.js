import proxyquire from 'proxyquire';
import sinon from 'sinon';
import { expect } from 'chai';
import {
  DEFAULT_ARCHIVE_FILE_NAME,
  DEFAULT_ARCHIVE_FOLDER_TYPE,
  DEFAULT_ARCHIVE_IS_TEMP,
  DEFAULT_ARCHIVE_PATH
} from '../../src/common/defaults';

const mockUploadCommand = (stub) => proxyquire('../../src/index', {'./upload': {default: stub}}).default;
const triggerUploadCommandMock = async (...options) => {
  const stub = sinon.stub();
  const perfectoCypress = mockUploadCommand(stub);
  await perfectoCypress.upload(...options);

  return stub;
};

const triggerUploadWithConfigMock = async (config, ...options) => {
  const stub = sinon.stub();
  const perfectoCypress = mockUploadCommand(stub);
  perfectoCypress.withConfigFile(config);
  await perfectoCypress.upload(...options);

  return stub;
};

describe('Upload - module', () => {
  describe('default parameters', () => {
    it('should have default value for archive, folderType, temporary', async () => {
      const stub = await triggerUploadCommandMock();

      expect(stub).to.have.been.calledWith(DEFAULT_ARCHIVE_PATH + DEFAULT_ARCHIVE_FILE_NAME, DEFAULT_ARCHIVE_FOLDER_TYPE, DEFAULT_ARCHIVE_IS_TEMP);
    });
  });

  describe('with config file', () => {
    it('should get required parameters from config file',  async () => {
      const stub = await triggerUploadWithConfigMock('../test/resources/perfecto-config.json');

      expect(stub).to.have.been.calledWith(DEFAULT_ARCHIVE_PATH + DEFAULT_ARCHIVE_FILE_NAME, DEFAULT_ARCHIVE_FOLDER_TYPE, DEFAULT_ARCHIVE_IS_TEMP, {
        cloud: 'cloud-name',
        securityToken: '*****'
      });
    });
    it('params should override config file',  async () => {
      const credentials = {
        cloud: 'cloud-name',
        securityToken: '*****'
      };
      const stub = await triggerUploadWithConfigMock('../test/resources/perfecto-config.json', 'archive/', 'PRIVATE', false, credentials);

      expect(stub).to.have.been.calledWithExactly('archive/', 'PRIVATE', false, credentials);
    });
  });
  describe('without config file', () => {
    it('should pass parameters to uploadCommand', async () => {
      const credentials = {
        cloud: 'test-cloud-name',
        securityToken: 'test-token'
      };
      const stub = await triggerUploadCommandMock('archive/', 'PRIVATE', false, credentials);

      expect(stub).to.have.been.calledWithExactly('archive/', 'PRIVATE', false, credentials);
    });
  });
});
