import proxyquire from 'proxyquire';
import sinon from 'sinon';
import { expect } from 'chai';
import {
  DEFAULT_TESTS_SPECS_EXT
} from '../../src/common/defaults';

const mockRunCommand = (stub) => proxyquire('../../src/index', {'./run': {default: stub}}).default;
const triggerRunCommandMock = async (options) => {
  const stub = sinon.stub();
  const perfectoCypress = mockRunCommand(stub);
  await perfectoCypress.run(options);

  return stub;
};

const triggerRunWithConfigMock = async (config, options) => {
  const stub = sinon.stub();
  const perfectoCypress = mockRunCommand(stub);
  perfectoCypress.withConfigFile(config);
  await perfectoCypress.run(options);

  return stub;
};

describe('Run - module', () => {
  describe('default parameters', () => {
    it('should have default value for tests.specsExt', async () => {
      const stub = await triggerRunCommandMock();

      expect(stub).to.have.been.calledWithExactly({
        credentials: {},
        env: {},
        tests: {specsExt: DEFAULT_TESTS_SPECS_EXT},
        reporting: {customFields: undefined},
        capabilities: []
      });
    });
  });

  describe('with config file', () => {
    it('should get required parameters from config file',  async () => {
      const stub = await triggerRunWithConfigMock('../test/resources/perfecto-config.json');

      expect(stub).to.have.been.calledWith({
        credentials: {
          cloud: 'cloud-name',
          securityToken: '*****'
        },
        env: {
          ENV_VAR_1: 'VAR_1_VALUE'
        },
        tests: {
          path: 'test/',
          artifactKey: '',
          ignore: [
            'tests/unit',
            'tests/license-checker'
          ],
          specsExt: '**.spec.js'
        },
        reporting: {
          jobName: 'some_job',
          jobNumber: 1,
          branch: 'some_branch',
          projectName: 'My_Cypress_project',
          projectVersion: 'v1.0',
          customFields: [{name: 'a', value: 'bbbb'}],
          author: 'sdet1@awesomecompany.com',
          tags: [
            'cypress',
            'plugin'
          ]
        },
        framework: 'cypress',
        capabilities: [
          {
            deviceType: 'Web',
            platformName: 'Windows',
            platformVersion: '10',
            browserName: 'Chrome',
            browserVersion: '80',
            resolution: '1024x768',
            location: 'US East',
            addHostsRecord: {
              localhost: '10.0.0.138'
            },
            maxNumOfDevices: 2
          },
          {
            deviceType: 'Web',
            platformName: 'Mac',
            platformVersion: 'Catalina',
            browserName: 'Chrome',
            browserVersion: '80',
            resolution: '1024x768',
            location: 'US East',
            addHostsRecord: {
              localhost: '10.0.0.138'
            },
            maxNumOfDevices: 1
          }
        ]
      });
    });
    it('params should override config file',  async () => {
      const stub = await triggerRunWithConfigMock('../test/resources/perfecto-config.json', {
        credentials: {
          cloud: 'test-cloud-name',
          securityToken: 'test-*****'
        },
        env: {
          ENV_VAR_1: 'VAR_1_OVERRIDE_VALUE'
        },
        tests: {
          path: 'foo-test/',
          artifactKey: 'test-ArtifactId',
          ignore: [
            '1-tests/unit',
            '2-tests/license-checker'
          ],
          specsExt: '**.spec1.js'
        },
        reporting: {
          jobName: 'test-some_job',
          jobNumber: 2,
          branch: 'test-some_branch',
          projectName: 'test-My_Cypress_project',
          projectVersion: 'test-v1.0',
          customFields: ['b,test-c'],
          author: 'test-sdet1@awesomecompany.com',
          tags: ['test-tag']
        },
        capabilities: [
          {
            deviceType: 'test-Web',
            platformName: 'test-Windows',
            platformVersion: 'test-10',
            browserName: 'test-Chrome',
            browserVersion: 'test-80',
            resolution: 'test-1024x768',
            location: 'test-US East',
            addHostsRecord: {
              localhost: 'test-10.0.0.138'
            },
            maxNumOfDevices: 3
          }
        ]
      });

      expect(stub).to.have.been.calledWithExactly({
        credentials: {
          cloud: 'test-cloud-name',
          securityToken: 'test-*****'
        },
        env: {
          ENV_VAR_1: 'VAR_1_OVERRIDE_VALUE'
        },
        tests: {
          path: 'foo-test/',
          artifactKey: 'test-ArtifactId',
          ignore: [
            '1-tests/unit',
            '2-tests/license-checker'
          ],
          specsExt: '**.spec1.js'
        },
        reporting: {
          jobName: 'test-some_job',
          jobNumber: 2,
          branch: 'test-some_branch',
          projectName: 'test-My_Cypress_project',
          projectVersion: 'test-v1.0',
          customFields: [{name: 'a', value: 'bbbb'}, {name: 'b', value: 'test-c'}],
          author: 'test-sdet1@awesomecompany.com',
          tags: [
            'test-tag'
          ]
        },
        framework: 'cypress',
        capabilities: [
          {
            deviceType: 'test-Web',
            platformName: 'test-Windows',
            platformVersion: 'test-10',
            browserName: 'test-Chrome',
            browserVersion: 'test-80',
            resolution: 'test-1024x768',
            location: 'test-US East',
            addHostsRecord: {
              localhost: 'test-10.0.0.138'
            },
            maxNumOfDevices: 3
          }
        ]
      });
    });
  });
  describe('without config file', () => {
    it('should pass parameters to runCommand', async () => {
      const params =  {
        credentials: {
          cloud: 'test-cloud-name',
          securityToken: 'test-*****'
        },
        tests: {
          path: 'foo-test/',
          artifactKey: 'test-ArtifactId',
          ignore: [
            '1-tests/unit',
            '2-tests/license-checker'
          ],
          specsExt: '**.spec1.js'
        },
        reporting: {
          jobName: 'test-some_job',
          jobNumber: 2,
          branch: 'test-some_branch',
          projectName: 'test-My_Cypress_project',
          projectVersion: 'test-v1.0',
          customFields: ['b,test-c'],
          author: 'test-sdet1@awesomecompany.com',
          tags: ['test-tag']
        },
        capabilities: [
          {
            deviceType: 'test-Web',
            platformName: 'test-Windows',
            platformVersion: 'test-10',
            browserName: 'test-Chrome',
            browserVersion: 'test-80',
            resolution: 'test-1024x768',
            location: 'test-US East',
            addHostsRecord: {
              localhost: 'test-10.0.0.138'
            },
            maxNumOfDevices: 3
          }
        ]
      };
      const stub = await triggerRunCommandMock(params);

      expect(stub).to.have.been.calledWithExactly({
        ...params,
        env: {},
        reporting: {
          ...params.reporting,
          customFields: [{
            name: 'b', value: 'test-c'
          }]
        }
      });
    });
  });
});
