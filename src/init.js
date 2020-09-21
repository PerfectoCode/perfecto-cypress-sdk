import path from "path";
import fs from "fs";
import { validateInitOptions } from './common/option-validation';
import { SUPPORTED_FRAMEWORKS } from './common/defaults';

const getPackageObject = (projectName) => ({
  name: projectName || 'first-perfecto-cypress-project',
  version: '0.0.1',
  dependencies: {},
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
  environmentVariables: {
    CYPRESS_PAGE_LOAD_TIMEOUT: '10000'
  },
  framework: SUPPORTED_FRAMEWORKS.CYPRESS,
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
    jobName: 'cypress_first_job',
    jobNumber: 1,
    branch: '',
    projectName: projectName || 'My_Cypress_project',
    projectVersion: 'v1.0',
    customFields: [],
    author: '',
    tags: ['cypress']
  }
});

const getCypressConfigObject = (projectId) => ({
  projectId: projectId || ''
});

export default (testsRoot, cypressProjectId, cloud, projectName) => {
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

  const cypressConfigPath = path.join(testsRoot, 'cypress-config.json');
  if (!fs.existsSync(cypressConfigPath)) {
    const cypressConfigObject = getCypressConfigObject(cypressProjectId);
    fs.writeFileSync(cypressConfigPath, JSON.stringify(cypressConfigObject, null, 2));
  }
}
