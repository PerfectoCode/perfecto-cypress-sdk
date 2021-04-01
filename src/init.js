import fs from "fs";
import path from 'path';
import { SUPPORTED_FRAMEWORKS } from './common/consts';

const getPerfectoConfigObject = (cloud, securityToken, testsPath) => ({
  credentials: {
    cloud: cloud || '<REPLACE_THIS_WITH_CLOUD_NAME>',
    securityToken: securityToken || '<REPLACE_THIS_WITH_SECURITY_TOKEN>'
  },
  capabilities: [
    {
      deviceType: 'Web',
      platformName: 'Windows',
      platformVersion: '10',
      browserName: 'Chrome',
      browserVersion: 'latest',
      resolution: '1024x768',
      location: 'US East'
    }
  ],
  env: {
    CYPRESS_PAGE_LOAD_TIMEOUT: '10000'
  },
  framework: SUPPORTED_FRAMEWORKS.CYPRESS,
  nodeVersion: '12',
  tests: {
    path: testsPath || '<REPLACE_THIS_WITH_PATH_TO_CYPRESS_FOLDER>',
    artifactKey: '',
    ignore: [
      '**/screenshots/**',
      '**/videos/**'
    ],
    specsExt: '**/*.spec.js'
  },
  reporting: {
    job: {
      name: 'cypress_first_job',
      number: 1,
      branch: ''
    },
    project: {
      name: 'My_Cypress_project',
      version: 'v1.0'
    },
    customFields: [],
    author: 'sdet1@awesomecompany.com',
    tags: [
      'cypress',
    ]
  }
});

export default (cloud, securityToken, testsRoot, addReporter) => {

  const perfectoConfigPath = 'perfecto-config.json';
  const perfectoConfigObject = getPerfectoConfigObject(cloud, securityToken, testsRoot);
  fs.writeFileSync(perfectoConfigPath, JSON.stringify(perfectoConfigObject, null, 2));

  if (addReporter === true && testsRoot) {
    const cypressSupportFile = path.join(testsRoot, 'cypress', 'support', 'index.js');
    try {
      fs.appendFileSync(cypressSupportFile, 'import \'perfecto-cypress-reporter\'; \n');
      console.log('perfecto-cypress-reporter has been imported in file', cypressSupportFile, 'successfully');
    }catch(e){
      console.log('Failed to update file', cypressSupportFile, ', cause:' , e);
    }
  }
};