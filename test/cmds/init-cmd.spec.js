import proxyquire from 'proxyquire';
import yargs from 'yargs';
import sinon from 'sinon';
import mockArgv from 'mock-argv';
import { expect } from 'chai';
import { objectToCliOptions } from '../util/cli-util';

const mockInitCommand = (stub) => {
  return proxyquire('../../src/cmds/init.cmd', {'../init': {default: stub}});
};

const triggerInitCommandMock = async (options) => {
  const initCommandStub = sinon.stub();
  const initCmdModule = mockInitCommand(initCommandStub);

  const command = yargs.command(initCmdModule);

  const argv = Object.entries(options).reduce((acc, [key, val]) => {
    acc.push(`--${[key]}=${val}`);
    return acc;
  }, ['init']);

  try {
    await mockArgv(argv, async () => command.parse('init' + objectToCliOptions({...options, prompt: false})));
  } catch (error) {
    return error;
  }
  return initCommandStub;
};

describe('Init - cmd', () => {
  it('should pass parameters to initCommand', async () => {
    const commandOptions = {
      'tests.path': 'archive-path/',
      cloud: 'test-cloud',
      token: 'tokeeeeeeeen'
    };

    const initCommandStub = await triggerInitCommandMock(commandOptions);

    expect(initCommandStub).to.have.been.calledOnce;
    expect(initCommandStub).to.have.been.calledWithExactly(
      commandOptions.cloud,
      commandOptions.token,
      commandOptions['tests.path'],
    );
  });

  it('should skip all parameters', async () => {
    const commandOptions = {
      'skip': true,
    };

    const initCommandStub = await triggerInitCommandMock(commandOptions);

    expect(initCommandStub).to.have.been.calledOnce;
    expect(initCommandStub).to.have.been.calledWithExactly(
      undefined,
      undefined,
      undefined
    );
  });

  it('should override cloud', async () => {
    const commandOptions = {
      'skip': true,
      cloud: 'test-cloud'
    };

    const initCommandStub = await triggerInitCommandMock(commandOptions);

    expect(initCommandStub).to.have.been.calledOnce;
    expect(initCommandStub).to.have.been.calledWithExactly(
      commandOptions.cloud,
      undefined,
      undefined
    );
  });

  it('should override token', async () => {
    const commandOptions = {
      'skip': true,
      token: 'test-token'
    };

    const initCommandStub = await triggerInitCommandMock(commandOptions);

    expect(initCommandStub).to.have.been.calledOnce;
    expect(initCommandStub).to.have.been.calledWithExactly(
      undefined,
      commandOptions.token,
      undefined
    );
  });

  it('should override tests path', async () => {
    const commandOptions = {
      'skip': true,
      'tests.path': 'archive-path/',
    };

    const initCommandStub = await triggerInitCommandMock(commandOptions);

    expect(initCommandStub).to.have.been.calledOnce;
    expect(initCommandStub).to.have.been.calledWithExactly(
      undefined,
      undefined,
      commandOptions['tests.path']
    );
  });
});
