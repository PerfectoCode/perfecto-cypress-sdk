import fs from 'fs';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';

import { getPerfectoHeaders, getRepositoryUrl, parseReportingError } from './common/api';
import { validateUploadOptions } from './common/option-validation';


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

  let formData = new FormData();
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

  formData.append('requestPart', JSON.stringify(requestPart));
  formData.append('inputPart', archiveFile);

  try {
     await axios.put(getRepositoryUrl(cloud), formData, {
      headers: {
        ...formData.getHeaders(),
        ...getPerfectoHeaders(cloud, securityToken)
      }
    });
  } catch (error) {
    throw 'Upload tests archive failed: ' + parseReportingError(error);
  }

  console.log('Tests archive uploaded:', artifactKeyIdentifier);
  return artifactKeyIdentifier;
}
