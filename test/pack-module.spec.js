import proxyquire from 'proxyquire';
import sinon from 'sinon';
import { expect } from 'chai';

const mockPackCommand = (stub) => proxyquire('../src/index', {'./pack': {default: stub}}).default;

describe('Pack - module', () => {
  describe('default parameters', () => {
    it('should have default value for outPath', async () => {
      const stub = sinon.stub();
      const perfectoCypress = mockPackCommand(stub);
      await perfectoCypress.pack('test/resources/**', []);

      expect(stub).to.have.been.calledWithExactly('test/resources/**', [], './');
    });
  });

  describe('with config file', () => {
    it('should get required parameters from config file',  async () => {
      const stub = sinon.stub();
      const perfectoCypress = mockPackCommand(stub);
      perfectoCypress.withConfigFile('../test/resources/perfecto-config.json');

      await perfectoCypress.pack();
      expect(stub).to.have.been.calledWith('test/', ['tests/unit', 'tests/license-checker']);
    });
    it('params should override config file',  async () => {
      const stub = sinon.stub();
      const perfectoCypress = mockPackCommand(stub);
      perfectoCypress.withConfigFile('../test/resources/perfecto-config.json');

      await perfectoCypress.pack('archive-path/', ['ignore-path'], 'out-path');
      expect(stub).to.have.been.calledWithExactly('archive-path/', ['ignore-path'], 'out-path');
    });
  });
  describe('without config file', () => {
    it('should pass parameters to packCommand', async () => {
      const stub = sinon.stub();
      const perfectoCypress = mockPackCommand(stub);
      await perfectoCypress.pack('archive-path/', ['ignore-path'], 'out-path');

      expect(stub).to.have.been.calledWithExactly('archive-path/', ['ignore-path'], 'out-path');
    });
  });
});
