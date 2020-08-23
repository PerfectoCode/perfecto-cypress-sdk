import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { getPerfectoHeaders, parseReportingError } from './common/api';

const DEFAULT_ARTIFACT_VERSION = 'v1';
const repositoryServiceUrl = '.app.perfectomobile.com/repository-management-webapp/rest/v1/repository-management/artifacts';

export default async (archive, folderType, temporary, {cloud, securityToken}) => {
  console.log('start uploading archive:', archive);

  const archiveFile = fs.readFileSync(path.resolve(archive));//, {encoding: 'buffer'});

  const parsedPath = path.parse(archive);

  if (parsedPath.ext !== '.zip') {
    throw 'Only zip files allowed as tests archive, actual file ext is: ' + parsedPath.ext;
  }

  const artifactId = parsedPath.name + parsedPath.ext;
  const requestPart = {
    contentType: 'zip',
    artifactType: 'GENERAL',
    folderType,
    keyDetails: {
      version: DEFAULT_ARTIFACT_VERSION,
      artifactId: artifactId
    },
    temporary,
    fileName: parsedPath.name
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
    throw 'Upload tests archive failed: ' + error.message + '\n' + error.response.data;
  }

  console.log('Tests archive uploaded:', folderType + ':' + artifactId);
  return requestPart;
}
