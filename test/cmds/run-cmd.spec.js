import proxyquire from 'proxyquire';
import yargs from 'yargs';
import sinon from 'sinon';
import { expect } from 'chai';
import { objectToCliOptions } from '../util/cli-util';

const mockPackCommand = (stub) => {
  return proxyquire('../../src/cmds/run.cmd', {'../run': {default: stub}});
};

const triggerRunCommandMock = async (options) => {
  const runCommandStub = sinon.stub();
  const packCmdModule = mockPackCommand(runCommandStub);

  const command = yargs.parserConfiguration({'camel-case-expansion': false}).command(packCmdModule,);

  try {
    await command.parse('run' + objectToCliOptions(options),);
  } catch (error) {
    return error;
  }
  return runCommandStub;
};

describe('Run - cmd', () => {
  describe('default parameters', () => {
    it('should have default value for tests.specsExt', async () => {
      const options = {
        config: 'test/resources/empty-perfecto-config.json',
        'credentials.cloud': 'foo',
        'credentials.securityToken': 'bar'
      };
      const runCommandStub = await triggerRunCommandMock(options);

      expect(runCommandStub).to.have.been.calledWith({
        env: {},
        credentials: {cloud: 'foo', securityToken: 'bar'},
        reporting: {customFields: undefined},
        nodeVersion: undefined,
        tests: {specsExt: '*.+(cy|spec).js'}
      });
    });
  });

  describe('with config file', () => {
    it('should get required parameters from config file', async () => {
      const options = {
        config: 'test/resources/perfecto-config.json'
      };
      const runCommandStub = await triggerRunCommandMock(options);

      expect(runCommandStub).to.have.been.calledWithExactly(
        {
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
            specsExt: '**/*.+(cy|spec).js'
          },
          reporting: {
            job: {
              name: 'some_job',
              number: 1,
              branch: 'some_branch'
            },
            project: {
              name: 'My_Cypress_project',
              version: 'v1.0'
            },
            customFields: [{name: 'a', value: 'bbbb'}],
            tags: [
              'cypress',
              'plugin'
            ]
          },
          framework: 'CYPRESS',
          nodeVersion: '12',
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
        }
      );
    });

    it('params should override config file', async () => {
      const options = {
        config: 'test/resources/perfecto-config.json',
        'credentials.cloud': 'test-cloud-name',
        'credentials.securityToken': 'test-*****',
        'tests.path': 'foo-test/',
        'env.ENV_VAR_1': 'VAR_1_OVERRIDE_VALUE',
        'tests.artifactKey': 'test-ArtifactId',
        'tests.ignore': '1-tests/unit 2-tests/license-checker',
        'tests.specsExt': '**.spec1.js',
        'reporting.job.name': 'test-some_job',
        'reporting.job.number': 2,
        'reporting.job.branch': 'test-some_branch',
        'reporting.project.name': 'test-My_Cypress_project',
        'reporting.project.version': 'test-v1.0',
        'reporting.customFields': 'b,test-c',
        'reporting.tags': 'test-tag',
        'nodeVersion': '13'
      };
      const runCommandStub = await triggerRunCommandMock(options);

      expect(runCommandStub).to.have.been.calledWithExactly(
        {
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
            job: {
              name: 'test-some_job',
              number: 2,
              branch: 'test-some_branch'
            },
            project: {
              name: 'test-My_Cypress_project',
              version: 'test-v1.0'
            },
            customFields: [{name: 'a', value: 'bbbb'}, {name: 'b', value: 'test-c'}],
            tags: [
              'test-tag'
            ]
          },
          framework: 'CYPRESS',
          nodeVersion: '13',
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
        }
      );
    });
  });

  describe('without config file', () => {
    it('should pass parameters to runCommand', async () => {
      const params = {
        'credentials.cloud': 'test-cloud-name',
        'credentials.securityToken': 'test-*****',
        'tests.path': 'foo-test/',
        'tests.artifactKey': 'test-ArtifactId',
        'env.ENV_VAR_1': 'VAR_1_OVERRIDE_VALUE',
        'tests.ignore': '1-tests/unit 2-tests/license-checker',
        'tests.specsExt': '**.spec1.js',
        'reporting.job.name': 'test-some_job',
        'reporting.job.number': 2,
        'reporting.job.branch': 'test-some_branch',
        'reporting.project.name': 'test-My_Cypress_project',
        'reporting.project.version': 'test-v1.0',
        'reporting.customFields': 'b,test-c',
        'reporting.tags': 'test-tag'
      };
      const options = {
        config: 'test/resources/empty-perfecto-config.json',
        ...params
      };
      const runCommandStub = await triggerRunCommandMock(options);

      expect(runCommandStub).to.have.been.calledWithExactly(
        {
          env: {
            ENV_VAR_1: 'VAR_1_OVERRIDE_VALUE'
          },
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
          nodeVersion: undefined,
          reporting: {
            job: {
              name: 'test-some_job',
              number: 2,
              branch: 'test-some_branch'
            },
            project: {
              name: 'test-My_Cypress_project',
              version: 'test-v1.0'
            },
            customFields: [{name: 'b', value: 'test-c'}],
            tags: [
              'test-tag'
            ]
          }
        }
      );
    });
  });
});
