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
    const stub = await triggerInitCommandMock('archive-path/', 'test-cloud', 'test-project-name');

    expect(stub).to.have.been.calledWithExactly('archive-path/', 'test-cloud', 'test-project-name');
  });
});
