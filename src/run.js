import glob from 'glob';
import axios from 'axios';
import fs from 'fs';
import packCommand from './pack';
import uploadCommand from './upload';
import monitorSession from './monitor';
import { getPerfectoHeaders } from './common/api';
import { DEFAULT_ARCHIVE_PATH } from './common/defaults';
import { validateRunOptions } from './common/option-validation';

const sdkVersion = require('../package.json').version;

export const getSpecs = (testsRoot, specExt) => {
  const specsPattern = testsRoot + '/' + specExt;
  let specs;
  try {
    specs = glob(specsPattern, {sync: true});
  } catch (error) {
    throw new Error('Failed to fined spec files: ' + error);
  }

  if (!specs?.length) {
    throw new Error('No spec files found for: ' + specsPattern + '\nUse --help for more information');
  }

  return specs;
}

export default async ({credentials, tests, capabilities, reporting, framework, env}) => {
  validateRunOptions({credentials, tests, capabilities, reporting, framework, env})

  let artifactKey = tests.artifactKey;

  if (!artifactKey) {
    const zipFilePath = await packCommand(tests.path, tests.ignore, DEFAULT_ARCHIVE_PATH);
    artifactKey = await uploadCommand(zipFilePath, 'PRIVATE', true, credentials);

    fs.unlink(zipFilePath, () => {/* Nothing to do here, is is ok if it failed */});
  }

  const specs = getSpecs(tests.path, tests.specsExt);
  let session;
  try {
    // TODO: (Elhay) get NASE service URL also from env var if provided
    session = await axios.post('https://' + credentials.cloud + '.perfectomobile.com/nase/rest/v1/session', {
      capabilities,
      reporting,
      artifactKey,
      framework,
      env,
      sdkVersion,
      specsExt: tests.specsExt,
      specs
    }, {
      headers: getPerfectoHeaders(credentials.cloud, credentials.securityToken)
    });
  } catch (error)  {
    throw 'Failed to create  session: ' + error.message + '\n' + error?.response?.data;
  }

  return monitorSession(session);
}
