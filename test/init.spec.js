import sinon from 'sinon';
import proxyquire from 'proxyquire';
import { expect } from 'chai';
import path from "path";

describe('Init', () => {

  it('Should pass params to config files', () => {
    const stub = {
      existsSync: sinon.stub().returns(false),
      writeFileSync: sinon.stub()
    };
    const mockInitCommand = proxyquire('../src/init', {'fs': {...stub}}).default;

    const testsRoot = 'archive-path/';
    const testsPath = path.join(testsRoot, 'package.json');
    const perfectoConfigPath = path.join(testsRoot, 'perfecto-config.json');
    const cypressConfigPath = path.join(testsRoot, 'cypress.json');

    const testProjectName = 'test-project-name';
    const testCloud = 'test-cloud';
    const cypressProjectId = 'ABCDEF';

    const JSONstub = sinon.stub(JSON, 'stringify');
    JSONstub.returnsArg(0);

    mockInitCommand(testsRoot, cypressProjectId, testCloud, testProjectName);

    expect(stub.writeFileSync).to.have.been.callCount(3);

    expect(stub.writeFileSync.getCall(0)).to.have.calledWith(testsPath, sinon.match({name: testProjectName}));

    expect(stub.writeFileSync.getCall(1)).to.have.calledWith(perfectoConfigPath, sinon.match({
      credentials: {cloud: testCloud},
      tests: {path: testsRoot},
      reporting: {project: {name: testProjectName}}
    }));

    expect(stub.writeFileSync.getCall(2)).to.have.calledWith(cypressConfigPath, sinon.match({
      projectId: cypressProjectId
    }));
    JSONstub.restore();
  });

  it('Should skip creation if files exist', () => {
    const stub = {
      existsSync: sinon.stub().returns(true),
      writeFileSync: sinon.stub()
    };
    const mockInitCommand = proxyquire('../src/init', {'fs': {...stub}}).default;

    const testsRoot = 'archive-path/';

    const testProjectName = 'test-project-name';
    const testCloud = 'test-cloud';
    const cypressProjectId = 'ABCDEF';

    mockInitCommand(testsRoot, cypressProjectId, testCloud, testProjectName);

    expect(stub.writeFileSync).to.not.have.been.called;
  });
});
