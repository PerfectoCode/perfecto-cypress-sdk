import proxyquire from 'proxyquire';
import yargs from 'yargs';
import sinon from 'sinon';
import { expect } from 'chai';
import { objectToCliOptions } from './util/cli-util';

const mockPackCommand = (stub) => {
  return proxyquire('../src/cmds/pack.cmd', {'../pack': {default: stub}});
};

const triggerPackCommandMock = async (options) => {
  const packCommandStub = sinon.stub();
  const packCmdModule = mockPackCommand(packCommandStub);

  const command = yargs.command(packCmdModule);

  try {
    await command.parse('pack' + objectToCliOptions(options));
  } catch (error) {
    return error;
  }
  return packCommandStub;
};

describe('Pack - cli', () => {
  describe('default parameters', () => {
    it('should have default value for outPath', async () => {
      const options = {
        config: 'test/resources/perfecto-config.json',
        'tests.path': 'archive-path/',
        'tests.ignore': 'ignore-path'
      };
      const packCommandStub = await triggerPackCommandMock(options);

      expect(packCommandStub).to.have.been.calledWithExactly(options['tests.path'], [options['tests.ignore']], './');
    });
  });

  describe('with config file', () => {
    it('should get required parameters from config file',  async () => {
      const packCommandStub = await triggerPackCommandMock({config: 'test/resources/perfecto-config.json'});

      expect(packCommandStub).to.have.been.calledWith('test/', ['tests/unit', 'tests/license-checker']);
    });

    it('params should override config file',  async () => {
      const commandOptions = {
        config: 'test/resources/perfecto-config.json',
        'tests.path': 'archive-path/',
        'tests.ignore': 'ignore-path',
        out: 'out-path'
      };
      const packCommandStub = await triggerPackCommandMock(commandOptions);

      expect(packCommandStub).to.have.been.calledWithExactly(
        commandOptions['tests.path'],
        [commandOptions['tests.ignore']],
        commandOptions.out
      );
    });
  });

  describe('without config file', () => {
    it('should pass parameters to packCommand', async () => {
      const commandOptions = {
        config: 'test/resources/empty-perfecto-config.json',
        'tests.path': 'archive-path/',
        'tests.ignore': 'ignore-path',
        out: 'out-path'
      };
      const packCommandStub = await triggerPackCommandMock(commandOptions);

      expect(packCommandStub).to.have.been.calledWithExactly(
        commandOptions['tests.path'],
        [commandOptions['tests.ignore']],
        commandOptions.out
      );
    });
  });
});
