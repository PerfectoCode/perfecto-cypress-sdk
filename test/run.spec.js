import { expect } from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import { getSpecs } from '../src/run';
import { DEFAULT_ARCHIVE_PATH } from '../src/common/defaults';
import {version as sdkVersion} from "../package.json";

const credentials = {cloud: 'cloud-name-perfectomobile-com', securityToken: '***'};
const nodeVersion = '13';
const scriptName = 'scriptName';
const runScripts = null;
const env = {ENV_VAR_1: 'VAR_1_VALUE'}
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
  "maxNumOfDevices": 2
}];
const reporting = { jobName: 'some_job' };
const framework = 'CYPRESS';
const defaultRunParams = {credentials, capabilities, reporting, scriptName, framework, runScripts, env, nodeVersion};

const mockPackResults = 'resolves-zipFilePath';
const mockUploadResults = 'resolves-artifactKey';
const mockSessionId = 'session-id';
const specs = ["test-file.text","test-file2.text"];


const mockRunCommand = (pack, upload, monitor, fetch) => {
  return proxyquire('../src/run', {
    'node-fetch-with-proxy': fetch,
    './pack': {default: pack},
    './upload': {default: upload},
    './monitor-session/monitor': {default: monitor}
  }
    ).default;
};

const mockFetchResponse = {
  text: () => {
    return mockSessionId;
  }
};

describe('Run', () => {
  let runCommand;
  let uploadStub;
  let packStub;
  let monitorStub;
  let fetchStub;

  beforeEach(() => {
    packStub = sinon.stub().resolves(mockPackResults);
    uploadStub = sinon.stub().resolves(mockUploadResults);
    fetchStub = sinon.stub().resolves(mockFetchResponse);
    monitorStub = sinon.stub();

    runCommand = mockRunCommand(packStub, uploadStub, monitorStub, fetchStub);
  })

  it('Should skip on pack an upload if artifactKey provided', async () => {
    const tests = {artifactKey: 'artifactKey.zip', path: 'test/resources/archive-files', specsExt: '*.text'};
    await runCommand({...defaultRunParams, tests});

    expect(packStub).to.not.called;
    expect(uploadStub).to.not.called;

    expect(fetchStub).to.calledOnceWith(
        sinon.match('https://' + credentials.cloud),
        {
          method: 'POST',
          body: sinon.match(JSON.stringify({
            capabilities,
            reporting,
            artifactKey: tests.artifactKey,
            scriptName,
            framework,
            runScripts,
            env,
            sdkVersion,
            nodeVersion,
            specsExt: tests.specsExt,
            specs: specs
          })),
          headers: sinon.match({
            'Accept': "application/json, text/plain, */*",
            'Content-Type': "application/json",
            'perfecto-tenantid': credentials.cloud,
            'Perfecto-Authorization': credentials.securityToken
          })
        });
  });

  it('Should find specs according to specsExt regex', () => {
    const specs = getSpecs('test/resources/archive-files', '**/*.text');
    expect(specs).to.have.lengthOf(3, "specs should contain 2 text files from root dir and one  from inner dir");
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
    expect(monitorStub).to.calledOnceWithExactly(credentials, mockSessionId);

    expect(fetchStub).to.calledOnceWith(
        sinon.match('https://' + credentials.cloud),
        {
          method: 'POST',
          body: sinon.match(JSON.stringify({
            capabilities,
            reporting,
            artifactKey: mockUploadResults,
            scriptName,
            framework,
            runScripts,
            env,
            sdkVersion,
            nodeVersion,
            specsExt: tests.specsExt,
            specs: specs
          })),
          headers: sinon.match({
            'Accept': "application/json, text/plain, */*",
            'Content-Type': "application/json",
            'perfecto-tenantid': credentials.cloud,
            'Perfecto-Authorization': credentials.securityToken
          })
        });
  });
});
