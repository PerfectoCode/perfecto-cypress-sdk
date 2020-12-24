import { expect } from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import fs from 'fs';
import path from 'path';

const mockUploadCommand = (post, put, getFormDataStub) => {
  function formDataMock() {
    this.append = getFormDataStub;
  }

  return proxyquire('../src/upload', {'axios': {post, put}, 'form-data': formDataMock}).default;
};

const credentials = {cloud: 'cloud-name-perfectomobile-com', securityToken: '***'};
const mockUploadUrl = 'uploadUrl.s3.com';

describe('Upload', () => {
  let uploadCommand;
  let postStub;
  let putStub;
  let getFormDataStub;

  beforeEach(() => {
    postStub = sinon.stub().resolves({data: {uploadUrl: mockUploadUrl}});
    putStub = sinon.stub().resolves();
    getFormDataStub = sinon.stub().resolves();
    uploadCommand = mockUploadCommand(postStub, putStub, getFormDataStub);
  });

  it('Should throw an exception if archive not found', async () => {
    await expect(
      uploadCommand('not-exist-file.zip', 'PRIVATE', false, credentials)
    ).to.be.rejectedWith('ENOENT: no such file or directory');
  });

  it('Should throw an exception for none zip archive', async () => {
    await expect(
      uploadCommand('test/resources/none-zip-archive.tar', 'PRIVATE', false, credentials)
    ).to.be.rejectedWith('Only zip files allowed as tests archive');
  });

  it('Should add unique value to temp archive name', async () => {
    const artifactId = await uploadCommand('test/resources/archive-files/perfecto-cypress.zip', 'PRIVATE', true, credentials);
    expect(artifactId).to.match(/PRIVATE:\d{13}_perfecto-cypress\.zip/, 'artifactId should include timestamp');
  });

  it('Should not add unique value to none temp archive', async () => {
    const artifactId = await uploadCommand('test/resources/archive-files/perfecto-cypress.zip', 'PRIVATE', false, credentials);
    expect(artifactId).to.eq('PRIVATE:perfecto-cypress.zip');
  });

  it('Validate artifact details', async () => {
    const folderType = 'PRIVATE';
    const temporary = false;
    const fileName = 'perfecto-cypress.zip';
    const archive = 'test/resources/archive-files/' + fileName;
    await uploadCommand(archive, folderType, temporary, credentials);
      expect(putStub).to.calledOnceWith(
      sinon.match('https://' + credentials.cloud + '.app.perfectomobile.com/repository-management-webapp/rest/v1/repository-management/artifacts/direct'),
      sinon.match.any,
      sinon.match({
      headers: {
        'perfecto-tenantid': credentials.cloud,
        'Perfecto-Authorization': credentials.securityToken
      }
    }));
  });

  it('Validate formData data', async () => {
    const folderType = 'PRIVATE';
    const temporary = false;
    const fileName = 'perfecto-cypress.zip';
    const archive = 'test/resources/archive-files/' + fileName;
    const requestPart = {
      contentType: 'application/zip',
      artifactType: 'GENERAL',
      folderType: 'PRIVATE',
      keyDetails: {
        artifactId: 'perfecto-cypress.zip'
      },
      temporary: false,
      fileName: 'perfecto-cypress.zip'
    };
    console.log(requestPart);
    await uploadCommand(archive, folderType, temporary, credentials);
    expect(getFormDataStub.withArgs('requestPart', JSON.stringify(requestPart)).onCall(1));
    expect(getFormDataStub.withArgs('inputPart', fs.readFileSync(path.resolve(archive))));
  });
});