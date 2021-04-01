import proxyquire from 'proxyquire';
import sinon from 'sinon';
import { expect } from 'chai';

const mockInitCommand = (stub) => proxyquire('../../src/index', {'./init': {default: stub}}).default;
const triggerInitCommandMock = async (...params) => {
  const stub = sinon.stub();
  const perfectoCypress = mockInitCommand(stub);
  await perfectoCypress.init(...params);

  return stub;
};

describe('Init - module', () => {
  it('should pass parameters to initCommand', async () => {
    const testCloud = 'test-cloud';
    const testToken = 'test-token';
    const testsPath = 'archive-path/';

    const stub = await triggerInitCommandMock(testCloud, testToken, testsPath);

    expect(stub).to.have.been.calledWithExactly(testCloud, testToken, testsPath);
  });

  it('should pass only cloud to initCommand', async () => {
    const testCloud = 'test-cloud';
    const testToken = undefined;
    const testsPath = undefined;

    const stub = await triggerInitCommandMock(testCloud, testToken, testsPath);
    expect(stub).to.have.been.calledWithExactly(testCloud, testToken, testsPath);
  });

  it('should pass only token to initCommand', async () => {
    const testCloud = undefined;
    const testToken = 'test-token';
    const testsPath = undefined;

    const stub = await triggerInitCommandMock(testCloud, testToken, testsPath);
    expect(stub).to.have.been.calledWithExactly(testCloud, testToken, testsPath);
  });
  
  it('should pass only tests path to initCommand', async () => {
    const testCloud = undefined;
    const testToken = undefined;
    const testsPath = 'tests-path';

    const stub = await triggerInitCommandMock(testCloud, testToken, testsPath);
    expect(stub).to.have.been.calledWithExactly(testCloud, testToken, testsPath);
  });

  it('should pass only add reporter to initCommand', async () => {
    const testCloud = undefined;
    const testToken = undefined;
    const testsPath = undefined;

    const stub = await triggerInitCommandMock(testCloud, testToken, testsPath);
    expect(stub).to.have.been.calledWithExactly(testCloud, testToken, testsPath);
  });
});
