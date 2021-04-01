import sinon from 'sinon';
import proxyquire from 'proxyquire';
import { expect } from 'chai';

describe('Init', () => {

  it('Should pass params to config files and add reporter', () => {
    const stub = {
      writeFileSync: sinon.stub(),
      appendFileSync: sinon.stub()
    };
    const mockInitCommand = proxyquire('../src/init', {'fs': {...stub}}).default;

    const perfectoConfigPath = 'perfecto-config.json';
    const testsRoot = 'archive-path/';
    const testCloud = 'test-cloud';
    const testToken = 'test-token';
    const addReporter = true;

    const JSONstub = sinon.stub(JSON, 'stringify');
    JSONstub.returnsArg(0);

    mockInitCommand(testCloud, testToken, testsRoot, addReporter);

    expect(stub.writeFileSync).to.have.been.callCount(1);

    expect(stub.writeFileSync.getCall(0)).to.have.calledWith(perfectoConfigPath, sinon.match({
      credentials: {cloud: testCloud, securityToken: testToken},
      tests: {path: testsRoot}
    }));

    expect(stub.appendFileSync).to.have.been.callCount(1);

    JSONstub.restore();
  });

  it('Should pass params to config files without add reporter', () => {
    const stub = {
      writeFileSync: sinon.stub(),
      appendFileSync: sinon.stub()
    };
    const mockInitCommand = proxyquire('../src/init', {'fs': {...stub}}).default;

    const perfectoConfigPath = 'perfecto-config.json';
    const testsRoot = 'archive-path/';
    const testCloud = 'test-cloud';
    const testToken = 'test-token';
    const addReporter = false;

    const JSONstub = sinon.stub(JSON, 'stringify');
    JSONstub.returnsArg(0);

    mockInitCommand(testCloud, testToken, testsRoot, addReporter);

    expect(stub.writeFileSync).to.have.been.callCount(1);

    expect(stub.writeFileSync.getCall(0)).to.have.calledWith(perfectoConfigPath, sinon.match({
      credentials: {cloud: testCloud, securityToken: testToken},
      tests: {path: testsRoot}
    }));

    expect(stub.appendFileSync).to.have.been.callCount(0);

    JSONstub.restore();
  });

  it('Should pass only cloud to config files', () => {
    const stub = {
      writeFileSync: sinon.stub(),
      appendFileSync: sinon.stub()
    };
    const mockInitCommand = proxyquire('../src/init', {'fs': {...stub}}).default;
    
    const perfectoConfigPath = 'perfecto-config.json';
    const testCloud = 'test-cloud';

    const JSONstub = sinon.stub(JSON, 'stringify');
    JSONstub.returnsArg(0);

    mockInitCommand(testCloud);

    expect(stub.writeFileSync).to.have.been.callCount(1);

    expect(stub.writeFileSync.getCall(0)).to.have.calledWith(perfectoConfigPath, sinon.match({
      credentials: {cloud: testCloud, securityToken: '<REPLACE_THIS_WITH_SECURITY_TOKEN>'},
      tests: {path: '<REPLACE_THIS_WITH_PATH_TO_CYPRESS_FOLDER>'}
    }));

    expect(stub.appendFileSync).to.have.been.callCount(0);

    JSONstub.restore();
  });

  it('Should pass only token to config file', () => {
    const stub = {
      writeFileSync: sinon.stub(),
      appendFileSync: sinon.stub()
    };
    const mockInitCommand = proxyquire('../src/init', {'fs': {...stub}}).default;
    
    const perfectoConfigPath = 'perfecto-config.json';
    const testToken = 'test-token';

    const JSONstub = sinon.stub(JSON, 'stringify');
    JSONstub.returnsArg(0);

    mockInitCommand(undefined, testToken);

    expect(stub.writeFileSync).to.have.been.callCount(1);

    expect(stub.writeFileSync.getCall(0)).to.have.calledWith(perfectoConfigPath, sinon.match({
      credentials: {cloud: '<REPLACE_THIS_WITH_CLOUD_NAME>', securityToken: testToken},
      tests: {path: '<REPLACE_THIS_WITH_PATH_TO_CYPRESS_FOLDER>'}
    }));

    expect(stub.appendFileSync).to.have.been.callCount(0);

    JSONstub.restore();
  });

  it('Should pass only tests path to config file with add reporter', () => {
    const stub = {
      writeFileSync: sinon.stub(),
      appendFileSync: sinon.stub()
    };
    const mockInitCommand = proxyquire('../src/init', {'fs': {...stub}}).default;
    
    const perfectoConfigPath = 'perfecto-config.json';
    const testsRoot = 'archive-path/';
    const addReporter = true;

    const JSONstub = sinon.stub(JSON, 'stringify');
    JSONstub.returnsArg(0);

    mockInitCommand(undefined, undefined, testsRoot, addReporter);

    expect(stub.writeFileSync).to.have.been.callCount(1);

    expect(stub.writeFileSync.getCall(0)).to.have.calledWith(perfectoConfigPath, sinon.match({
      credentials: {cloud: '<REPLACE_THIS_WITH_CLOUD_NAME>', securityToken: '<REPLACE_THIS_WITH_SECURITY_TOKEN>'},
      tests: {path: testsRoot}
    }));

    expect(stub.appendFileSync).to.have.been.callCount(1);

    JSONstub.restore();
  });

  it('Should pass only tests path to config file without add reporter', () => {
    const stub = {
      writeFileSync: sinon.stub(),
      appendFileSync: sinon.stub()
    };
    const mockInitCommand = proxyquire('../src/init', {'fs': {...stub}}).default;
    
    const perfectoConfigPath = 'perfecto-config.json';
    const testsRoot = 'archive-path/';
    const addReporter = false;

    const JSONstub = sinon.stub(JSON, 'stringify');
    JSONstub.returnsArg(0);

    mockInitCommand(undefined, undefined, testsRoot, addReporter);

    expect(stub.writeFileSync).to.have.been.callCount(1);

    expect(stub.writeFileSync.getCall(0)).to.have.calledWith(perfectoConfigPath, sinon.match({
      credentials: {cloud: '<REPLACE_THIS_WITH_CLOUD_NAME>', securityToken: '<REPLACE_THIS_WITH_SECURITY_TOKEN>'},
      tests: {path: testsRoot}
    }));

    expect(stub.appendFileSync).to.have.been.callCount(0);

    JSONstub.restore();
  });
  
  it('Should not add reporter if tests path not provided', () => {
    const stub = {
      writeFileSync: sinon.stub(),
      appendFileSync: sinon.stub()
    };
    const mockInitCommand = proxyquire('../src/init', {'fs': {...stub}}).default;
    
    const perfectoConfigPath = 'perfecto-config.json';
    const addReporter = false;

    const JSONstub = sinon.stub(JSON, 'stringify');
    JSONstub.returnsArg(0);

    mockInitCommand(undefined, undefined, undefined, addReporter);

    expect(stub.writeFileSync).to.have.been.callCount(1);

    expect(stub.writeFileSync.getCall(0)).to.have.calledWith(perfectoConfigPath, sinon.match({
      credentials: {cloud: '<REPLACE_THIS_WITH_CLOUD_NAME>', securityToken: '<REPLACE_THIS_WITH_SECURITY_TOKEN>'},
      tests: {path: '<REPLACE_THIS_WITH_PATH_TO_CYPRESS_FOLDER>'}
    }));

    expect(stub.appendFileSync).to.have.been.callCount(0);

    JSONstub.restore();
  });

});
