import axios from 'axios';
import fs from 'fs';
import packCommand from './pack';
import uploadCommand from './upload';
import monitorSession from './monitor';
import { getPerfectoHeaders } from './common/api';
import { DEFAULT_ARCHIVE_PATH } from './common/consts';

export default async ({credentials, tests, capabilities, reporting}) => {
  let artifactKey = tests.artifactKey;

  if (!artifactKey) {
    const zipFilePath = await packCommand(tests.path, tests.ignore, DEFAULT_ARCHIVE_PATH);
    artifactKey = await uploadCommand(zipFilePath, 'PRIVATE', true, credentials);

    fs.unlink(zipFilePath, () => {/* Nothing to do here, is is ok if it failed */});
  }

  let session;
  try {
    // TODO: (Elhay) get NASE service URL also from env var if provided
    session = await axios.post('https://' + credentials.cloud + '.perfectomobile.com/nase/rest/v1/session', {
      capabilities,
      reporting,
      artifactKey,
      framework: 'cypress',
      specs: tests.specs
    }, {
      headers: getPerfectoHeaders(credentials.cloud, credentials.securityToken)
    });
  } catch (error)  {
    throw 'Failed to create  session: ' + error.message + '\n' + error.response.data;
  }

  monitorSession(session);
}
