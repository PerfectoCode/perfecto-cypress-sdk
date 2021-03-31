import path from "path";
import fs from "fs";
import { validateInitOptions } from './common/option-validation';
import { SUPPORTED_FRAMEWORKS } from './common/consts';

const getPackageObject = (projectName) => ({
  name: projectName || 'first-perfecto-cypress-project',
  version: '0.0.1',
  dependencies: {
    'cypress': '5.6.0',
    'perfecto-cypress-reporter': 'latest'
  },
  devDependencies: {}
});

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

export default (cloud, securityToken, testsRoot) => {
  
  const perfectoConfigPath = 'perfecto-config.json';
  const perfectoConfigObject = getPerfectoConfigObject(cloud, securityToken, testsRoot);
  fs.writeFileSync(perfectoConfigPath, JSON.stringify(perfectoConfigObject, null, 2));

};
