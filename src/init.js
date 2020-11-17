import path from "path";
import fs from "fs";
import { validateInitOptions } from './common/option-validation';
import { SUPPORTED_FRAMEWORKS } from './common/consts';

const getPackageObject = (projectName) => ({
  name: projectName || 'first-perfecto-cypress-project',
  version: '0.0.1',
  dependencies: {
    'cypress': 'latest',
    'perfecto-cypress-reporter': 'latest'
  },
  devDependencies: {}
});

const getPerfectoConfigObject = (cloud, testsPath, projectName) => ({
  credentials: {
    cloud: cloud || '<REPLACE_THIS_WITH_CLOUD_NAME>',
    securityToken: ''
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
    path: testsPath || 'test/',
    artifactKey: '',
    ignore: [
      'screenshots/**',
      'video/**'
    ],
    specsExt: '**.spec.js'
  },
  reporting: {
    job: {
      name: 'cypress_first_job',
      number: 1,
      branch: ''
    },
    project: {
      name: projectName || 'My_Cypress_project',
      version: 'v1.0'
    },
    customFields: [],
    author: 'sdet1@awesomecompany.com',
    tags: [
      'cypress',
    ]
  }
});

export default (testsRoot, cloud, projectName) => {
  validateInitOptions(testsRoot);

  const packagePath = path.join(testsRoot, 'package.json');
  if (!fs.existsSync(packagePath)) {
    const packageObject = getPackageObject(projectName);
    fs.writeFileSync(packagePath, JSON.stringify(packageObject, null, 2));
  }

  const perfectoConfigPath = path.join(testsRoot, 'perfecto-config.json');
  if (!fs.existsSync(perfectoConfigPath)) {
    const perfectoConfigObject = getPerfectoConfigObject(cloud, testsRoot, projectName);
    fs.writeFileSync(perfectoConfigPath, JSON.stringify(perfectoConfigObject, null, 2));
  }

  const cypressConfigPath = path.join(testsRoot, 'cypress.json');
  if (!fs.existsSync(cypressConfigPath)) {
    fs.writeFileSync(cypressConfigPath, '{}');
  }
}
