import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { getPerfectoHeaders, parseReportingError } from './common/api';
import { validateUploadOptions } from './common/option-validation';

const repositoryServiceUrl = '.app.perfectomobile.com/repository-management-webapp/rest/v1/repository-management/artifacts';

export default async (archive, folderType, temporary, {cloud, securityToken}) => {
  validateUploadOptions(archive, folderType, temporary, {cloud, securityToken});

  console.log('Start uploading archive:', archive);

  const archiveFile = fs.readFileSync(path.resolve(archive));

  const parsedPath = path.parse(archive);

  if (parsedPath.ext !== '.zip') {
    throw 'Only zip files allowed as tests archive, actual file ext is: ' + parsedPath.ext;
  }

  let artifactId = parsedPath.name + parsedPath.ext;

  if (temporary) {
    artifactId = new Date().getTime() + '_' + artifactId;
  }
  const artifactKeyIdentifier = folderType + ':' + artifactId;

  const requestPart = {
    contentType: 'application/zip',
    artifactType: 'GENERAL',
    folderType,
    keyDetails: {
      artifactId: artifactId
    },
    temporary,
    fileName: artifactId
  };

  let getUploadUrlRes;
  try {
    getUploadUrlRes = await axios.post('https://' + cloud + repositoryServiceUrl, requestPart, {
      headers: getPerfectoHeaders(cloud, securityToken)
    });
  } catch (error) {
    throw 'Upload tests archive failed: ' + parseReportingError(error);
  }

  try {
    await axios.put(getUploadUrlRes.data.uploadUrl, archiveFile);
  } catch (error) {
    throw 'Upload tests archive failed: ' + error.message + '\n' + error?.response?.data || error;
  }

  console.log('Tests archive uploaded:', artifactKeyIdentifier);
  return artifactKeyIdentifier;
}
