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
    const addreporter = true;
    
    expect(initCommandStub).to.have.been.calledOnce;
    expect(initCommandStub).to.have.been.calledWithExactly(
      commandOptions.cloud,
      commandOptions.token,
      commandOptions['tests.path'],
      addreporter
    );
  });

  it('should skip all parameters', async () => {
    const commandOptions = {
      'skip': true,
    };

    const initCommandStub = await triggerInitCommandMock(commandOptions);
    const cloud = undefined;
    const token = undefined;
    const testsPath = './';
    const addReporter = true;

    expect(initCommandStub).to.have.been.calledOnce;
    expect(initCommandStub).to.have.been.calledWithExactly(
      cloud,
      token,
      testsPath,
      addReporter
    );
  });

  it('should override cloud', async () => {
    const commandOptions = {
      'skip': true,
      cloud: 'test-cloud'
    };

    const initCommandStub = await triggerInitCommandMock(commandOptions);
    const cloud = commandOptions.cloud;
    const token = undefined;
    const testsPath = './';
    const addReporter = true;

    expect(initCommandStub).to.have.been.calledOnce;
    expect(initCommandStub).to.have.been.calledWithExactly(
      cloud,
      token,
      testsPath,
      addReporter
    );
  });

  it('should override token', async () => {
    const commandOptions = {
      'skip': true,
      token: 'test-token'
    };

    const initCommandStub = await triggerInitCommandMock(commandOptions);

    const cloud = undefined;
    const token = commandOptions.token;
    const testsPath = './';
    const addReporter = true;

    expect(initCommandStub).to.have.been.calledOnce;
    expect(initCommandStub).to.have.been.calledWithExactly(
      cloud,
      token,
      testsPath,
      addReporter
    );
  });

  it('should override tests path', async () => {
    const commandOptions = {
      'skip': true,
      'tests.path': 'archive-path/',
    };

    const initCommandStub = await triggerInitCommandMock(commandOptions);

    const cloud = undefined;
    const token = undefined;
    const testsPath = commandOptions['tests.path'];
    const addReporter = true;

    expect(initCommandStub).to.have.been.calledOnce;
    expect(initCommandStub).to.have.been.calledWithExactly(
      cloud,
      token,
      testsPath,
      addReporter
    );
  });

  it('should override add reporter', async () => {
    const commandOptions = {
      'skip': true,
      'add-reporter': false
    };

    const initCommandStub = await triggerInitCommandMock(commandOptions);

    const cloud = undefined;
    const token = undefined;
    const testsPath = './';
    const addReporter = commandOptions['add-reporter'];

    expect(initCommandStub).to.have.been.calledOnce;
    expect(initCommandStub).to.have.been.calledWithExactly(
      cloud,
      token,
      testsPath,
      addReporter
    );
  });
});
