import glob from 'glob';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import packCommand from './pack';
import uploadCommand from './upload';
import monitorSession from './monitor-session/monitor';
import { getBackendBaseUrl, getPerfectoHeaders } from './common/api';
import { DEFAULT_ARCHIVE_PATH } from './common/defaults';
import { validateRunOptions } from './common/option-validation';
import { getIgnoredFiles } from './common/utils';

const sdkVersion = require('../package.json').version;

export const getSpecs = (testsRoot, specExt, ignore) => {
  const specsPattern = specExt;
  let specs;
  try {
    specs = glob(specsPattern, {
      cwd: path.resolve(testsRoot),
      ignore: getIgnoredFiles(ignore),
      sync: true
    });
  } catch (error) {
    throw new Error('Failed to fined spec files: ' + error);
  }

  if (!specs?.length) {
    throw new Error('No spec files found for: ' + specsPattern + '\nUse --help for more information');
  }

  return specs;
}

const validatePackageFile = () => {
  if (!fs.existsSync('package.json')) {
    throw '\nError: package.json file not found, you can use init command to create it or create it manually.\n';
  }
};

export default async ({credentials, tests, capabilities, reporting, scriptName, framework, env, nodeVersion}) => {
  validateRunOptions({credentials, tests, capabilities, reporting, framework, env, nodeVersion})
  validatePackageFile();
  let artifactKey = tests.artifactKey;

  if (!artifactKey) {
    const zipFilePath = await packCommand(tests.path, tests.ignore, DEFAULT_ARCHIVE_PATH);
    artifactKey = await uploadCommand(zipFilePath, 'PRIVATE', true, credentials);

    fs.unlink(zipFilePath, () => {/* Nothing to do here, is is ok if it failed */});
  }

  const specs = getSpecs(tests.path, tests.specsExt, tests.ignore);
  let session;
  try {
    session = await axios.post(getBackendBaseUrl(credentials.cloud) + '/sessions', {
      capabilities,
      reporting,
      artifactKey,
      scriptName,
      framework,
      env,
      sdkVersion,
      nodeVersion,
      specsExt: tests.specsExt,
      specs
    }, {
      headers: getPerfectoHeaders(credentials.cloud, credentials.securityToken)
    });
  } catch (error)  {
    if (error?.response?.status === 404 && error?.response?.data === "") {
      //error from ngnix
      throw '\nFailed to create session: ' + error.message + ' - ' + "cypress is not enabled on this cloud, please contact support";
    }
    throw '\nFailed to create session: ' + error.message + '\n' + JSON.stringify(error?.response?.data, null, 2);
  }

  return monitorSession(credentials, session);
}
