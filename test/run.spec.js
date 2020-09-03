import { expect } from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import { getSpecs } from '../src/run';
import { DEFAULT_ARCHIVE_PATH } from '../src/common/defaults';

const credentials = {cloud: 'cloud-name', securityToken: '***'};
const capabilities = [{
  "deviceType": "Web",
  "platformName": "Windows",
  "platformVersion": "10",
  "browserName": "Chrome",
  "browserVersion": "80",
  "resolution": "1024x768",
  "location": "US East",
  "addHostsRecord": {
    "localhost": "10.0.0.138"
  },
  "numOfDevices": 2
}];
const reporting = { jobName: 'some_job' };
const framework = 'cypress';
const defaultRunParams = {credentials, capabilities, reporting, framework};

const mockPackResults = 'resolves-zipFilePath';
const mockUploadResults = 'resolves-artifactKey';
const mockSessionId = 'session-id';

const mockRunCommand = (pack, upload, monitor, post) => {
  return proxyquire('../src/run', {
    'axios': {post},
    './pack': {default: pack},
    './upload': {default: upload},
    './monitor': {default: monitor}
  }
    ).default;
};

describe('Run', () => {
  let runCommand;
  let uploadStub;
  let packStub;
  let monitorStub;
  let postStub;

  beforeEach(() => {
    packStub = sinon.stub().resolves(mockPackResults);
    uploadStub = sinon.stub().resolves(mockUploadResults);
    postStub = sinon.stub().resolves(mockSessionId);
    monitorStub = sinon.stub();

    runCommand = mockRunCommand(packStub, uploadStub, monitorStub, postStub);
  })

  it('Should skip on pack an upload if artifactKey provided', async () => {
    const tests = {artifactKey: 'artifactKey.zip', path: 'test/resources/archive-files', specsExt: '*.text'};
    await runCommand({...defaultRunParams, tests});

    expect(packStub).to.not.called;
    expect(uploadStub).to.not.called;
    expect(postStub).to.calledOnceWith(sinon.match('https://'), sinon.match({artifactKey: tests.artifactKey}));
  });

  it('Should find specs according to specsExt regex', () => {
    const specs = getSpecs('test/resources/archive-files', '*.text');
    specs.forEach(i => expect(i).to.have.match(/\.text/, 'found spec file without *.text'));
  });

  it('Should throw exception if no specs found', () => {
    expect(
      () => getSpecs('test/resources/archive-files', '*.none')
    ).to.throw('No spec files found');
  });

  it('Validate create session request data', async () => {
    const tests = {path: 'test/resources/archive-files', specsExt: '*.text'};
    await runCommand({...defaultRunParams, tests});

    expect(packStub).to.calledOnceWithExactly(tests.path, undefined, DEFAULT_ARCHIVE_PATH);
    expect(uploadStub).to.calledOnceWithExactly(mockPackResults, 'PRIVATE', true, credentials);
    expect(monitorStub).to.calledOnceWithExactly(mockSessionId);

    expect(postStub).to.calledOnceWith(
      sinon.match('https://' + credentials.cloud),
      sinon.match({
        capabilities,
        reporting,
        artifactKey: mockUploadResults,
        framework,
        specsExt: tests.specsExt
      }),
      {
        headers: {
          'perfecto-tenantid': credentials.cloud,
          'Perfecto-Authorization': credentials.securityToken
        }
      }
    );
  });

});
