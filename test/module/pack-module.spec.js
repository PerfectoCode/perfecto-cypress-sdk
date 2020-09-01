import proxyquire from 'proxyquire';
import sinon from 'sinon';
import { expect } from 'chai';

const mockPackCommand = (stub) => proxyquire('../../src/index', {'./pack': {default: stub}}).default;
const triggerPackCommandMock = async (...options) => {
  const stub = sinon.stub();
  const perfectoCypress = mockPackCommand(stub);
  await perfectoCypress.pack(...options);

  return stub;
};

const triggerPackWithConfigMock = async (config, ...options) => {
  const stub = sinon.stub();
  const perfectoCypress = mockPackCommand(stub);
  perfectoCypress.withConfigFile(config);
  await perfectoCypress.pack(...options);

  return stub;
};

describe('Pack - module', () => {
  describe('default parameters', () => {
    it('should have default value for outPath', async () => {
      const stub = await triggerPackCommandMock('test/resources/**', []);

      expect(stub).to.have.been.calledWithExactly('test/resources/**', [], './');
    });
  });

  describe('with config file', () => {
    it('should get required parameters from config file',  async () => {
      const stub = await triggerPackWithConfigMock('../test/resources/perfecto-config.json');

      expect(stub).to.have.been.calledWith('test/', ['tests/unit', 'tests/license-checker']);
    });
    it('params should override config file',  async () => {
      const stub = await triggerPackWithConfigMock('../test/resources/perfecto-config.json', 'archive-path/', ['ignore-path'], 'out-path');

      expect(stub).to.have.been.calledWithExactly('archive-path/', ['ignore-path'], 'out-path');
    });
  });
  describe('without config file', () => {
    it('should pass parameters to packCommand', async () => {
      const stub = await triggerPackCommandMock('archive-path/', ['ignore-path'], 'out-path');

      expect(stub).to.have.been.calledWithExactly('archive-path/', ['ignore-path'], 'out-path');
    });
  });
});
