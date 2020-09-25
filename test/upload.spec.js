import { expect } from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import fs from "fs";
import path from "path";

const mockUploadCommand = (post, put) => {
  return proxyquire('../src/upload', {'axios': {post, put}}).default;
};

const credentials = {cloud: 'cloud-name-perfectomobile-com', securityToken: '***'};
const mockUploadUrl = 'uploadUrl.s3.com';

describe('Upload', () => {
  let uploadCommand;
  let postStub;
  let putStub;

  beforeEach(() => {
    postStub = sinon.stub().resolves({data: {uploadUrl: mockUploadUrl}});
    putStub = sinon.stub().resolves();

    uploadCommand = mockUploadCommand(postStub, putStub);
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
    await uploadCommand('test/resources/archive-files/' + fileName, folderType, temporary, credentials);
    expect(postStub).to.calledOnceWithExactly(
      sinon.match('https://' + credentials.cloud + '.'),
      {
      contentType: 'application/zip',
      artifactType: 'GENERAL',
      folderType,
      keyDetails: {
        artifactId: 'perfecto-cypress.zip'
      },
      temporary,
      fileName: 'perfecto-cypress.zip'
    }, {
      headers: {
        'perfecto-tenantid': credentials.cloud,
        'Perfecto-Authorization': credentials.securityToken
      }
    });
  });

  it('Should call s3 with uploadUrl', async () => {
    const zipArchive = 'test/resources/archive-files/perfecto-cypress.zip';
    await uploadCommand(zipArchive, 'PRIVATE', false, credentials);

    expect(putStub).to.calledOnceWithExactly(mockUploadUrl, fs.readFileSync(path.resolve(zipArchive)))
  });
});
