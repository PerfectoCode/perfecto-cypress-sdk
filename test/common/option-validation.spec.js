import { expect } from "chai";
import { validatePackOptions, validateRunOptions, validateUploadOptions } from '../../src/common/option-validation';

const assertParam = (name, validator, type, invalidValue) => {
  expect(validator).to.throw(`Invalid ${type} value: ${invalidValue}\nArgument Name: ${name}`);
};

const assertRequiredBooleanParam = (name, validator) => {
  assertParam(name, validator, 'boolean', 'undefined');
};

const assertRequiredStringParam = (name, validator) => {
  assertParam(name, validator, 'string', 'undefined');
};

const assertRequiredArrayParam = (name, validator, orEmpty, invalidValue='undefined') => {
  const orEmptyString = orEmpty ? 'OrEmpty' : '';
  assertParam(name, validator, 'array' + orEmptyString, invalidValue);
};

const assertEmptyStringParam = (name, validator) => {
  assertParam(name, validator, 'string', '');
};

const assertEmptyBooleanParam = (name, validator) => {
  assertParam(name, validator, 'boolean', '');
};

describe('Parameters validation', () => {
  describe('Pack command', () => {
    it('should throw exception without required param: ignoreRegexList', () => {
      assertRequiredArrayParam('ignoreRegexList', () => validatePackOptions('test/resources/**'), true);
    });

    it('should throw exception without required param: pathRegex', () => {
      assertRequiredStringParam('pathRegex', () => validatePackOptions());
    });
    it('should throw exception without required param: outPath', () => {
      assertRequiredStringParam('outPath', () => validatePackOptions('foo', []));
    });

    it('should throw exception for empty pathRegex', () => {
      assertEmptyStringParam('pathRegex', () => validatePackOptions('', [], ''));
    });
    it('should not throw exception for empty ignoreRegexList', () => {
      expect(() => validatePackOptions('foo', [], 'bar')).to.not.throw();
    });
    it('should throw exception for empty outPath', () => {
      assertEmptyStringParam('outPath', () => validatePackOptions('foo', ['bar'], ''));
    });
  });

  describe('Upload command', () => {
    it('should throw exception without required param: archive', () => {
      assertRequiredStringParam(
        'archive',
        () => validateUploadOptions(undefined, 'bar', true, {cloud: '*', securityToken: '*'})
      );
    });
    it('should throw exception without required param: folderType', () => {
      assertRequiredStringParam(
        'folderType',
        () => validateUploadOptions('foo', undefined, true, {cloud: '*', securityToken: '*'})
      );
    });
    it('should throw exception illegal value in param: folderType', () => {
      expect(
        () => validateUploadOptions('foo', 'SHARED', true, {cloud: '*', securityToken: '*'})
      ).to.throw('Invalid string value: SHARED\nArgument Name: folderType.\nit has to be one of PRIVATE,PUBLIC,GROUP');
    });
    it('should throw exception without required param: temporary', () => {
      assertRequiredBooleanParam(
        'temporary',
        () => validateUploadOptions('foo', 'bar', undefined, {cloud: '*', securityToken: '*'})
      );
    });
    it('should throw exception without required param: credentials.cloud', () => {
      assertRequiredStringParam(
        'credentials.cloud',
        () => validateUploadOptions('foo', 'bar', undefined, {securityToken: '*'})
      );
    });
    it('should throw exception without required param: credentials.securityToken', () => {
      assertRequiredStringParam(
        'credentials.securityToken',
        () => validateUploadOptions('foo', 'bar', undefined, {cloud: '*'})
      );
    });

    it('should throw exception for empty archive', () => {
      assertEmptyStringParam('archive', () => validateUploadOptions('', 'bar', true, {cloud: '*', securityToken: '*'}));
    });
    it('should throw exception for empty folderType', () => {
      assertEmptyStringParam('folderType', () => validateUploadOptions('foo', '', true, {cloud: '*', securityToken: '*'}));
    });
    it('should throw exception for empty temporary', () => {
      assertEmptyBooleanParam('temporary', () => validateUploadOptions('foo', 'bar', '', {cloud: '*', securityToken: '*'}));
    });
    it('should throw exception for empty credentials.cloud', () => {
      assertEmptyStringParam('credentials.cloud', () => validateUploadOptions('foo', 'bar', true, {cloud: '', securityToken: '**'}));
    });
    it('should throw exception for empty credentials.securityToken', () => {
      assertEmptyStringParam('credentials.securityToken', () => validateUploadOptions('foo', 'bar', true, {cloud: '**', securityToken: ''}));
    });
  });

  describe('Run command', () => {

    it('should throw exception without required param: tests.path', () => {
      expect(
        () => validateRunOptions({
          credentials: {cloud: '*', securityToken: '*'},
          tests: {
            artifactKey: '*',
            specsExt: '*'
          },
          capabilities: [{}],
          reporting: {}
        })
      ).to.not.throw();

      expect(
        () => validateRunOptions({
          credentials: {cloud: '*', securityToken: '*'},
          tests: {
            path: '*',
            specsExt: '*'
          },
          capabilities: [{}],
          reporting: {}
        })
      ).to.not.throw();

      assertRequiredStringParam(
        'tests.path',
        () => validateRunOptions({
          credentials: {cloud: '*', securityToken: '*'},
          tests: {
            specsExt: '*'
          },
          capabilities: [{}],
          reporting: {}
        })
      );
    });
    it('should throw exception without required param: tests.specsExt', () => {
      assertRequiredStringParam(
        'tests.specsExt',
        () => validateRunOptions(validateRunOptions({
          credentials: {cloud: '*', securityToken: '*'},
          tests: {
            path: '*'
          },
          capabilities: [{}],
          reporting: {}
        }))
      );
    });
    it('should throw exception illegal value in param: capabilities', () => {
      assertRequiredArrayParam(
        'capabilities',
        () => validateRunOptions(validateRunOptions({
          credentials: {cloud: '*', securityToken: '*'},
          tests: {
            path: '*',
            specsExt: '*'
          },
          reporting: {}
        })),
        false
      );
    });
    it('should throw exception without required param: reporting', () => {
      expect(
        () => validateRunOptions({
          credentials: {cloud: '*', securityToken: '*'},
          tests: {
            path: '*',
            specsExt: '*'
          },
          capabilities: [{}]
        })
      ).to.not.throw();
    });
    it('should throw exception without required param: credentials.cloud', () => {
      assertRequiredStringParam(
        'credentials.cloud',
        () => validateRunOptions({
          credentials: {securityToken: '*'},
          tests: {
            specsExt: '*',
            path: '*'
          },
          capabilities: [{}],
          reporting: {}
        })
      );
    });
    it('should throw exception without required param: credentials.securityToken', () => {
      assertRequiredStringParam(
        'credentials.securityToken',
        () => validateRunOptions({
          credentials: {cloud: '*'},
          tests: {
            specsExt: '*',
            path: '*'
          },
          capabilities: [{}],
          reporting: {}
        })
      );
    });

    it('should throw exception for empty tests.path', () => {
      expect(
        () => validateRunOptions({
          credentials: {cloud: '*', securityToken: '*'},
          tests: {
            artifactKey: '*',
            path: '',
            specsExt: '*'
          },
          capabilities: [{}],
          reporting: {}
        })
      ).to.not.throw();

      expect(
        () => validateRunOptions({
          credentials: {cloud: '*', securityToken: '*'},
          tests: {
            artifactKey: '',
            path: '*',
            specsExt: '*'
          },
          capabilities: [{}],
          reporting: {}
        })
      ).to.not.throw();

      assertEmptyStringParam('tests.path', () => validateRunOptions({
        credentials: {cloud: '*', securityToken: '*'},
        tests: {
          artifactKey: '',
          path: '',
          specsExt: '*'
        },
        capabilities: [{}],
        reporting: {}
      }));
    });
    it('should throw exception for empty tests.specsExt', () => {
      assertEmptyStringParam('tests.specsExt', () => validateRunOptions({
        credentials: {cloud: '*', securityToken: '*'},
        tests: {
          path: '*',
          specsExt: ''
        },
        capabilities: [{}],
        reporting: {}
      }));
    });
    it('should throw exception for empty capabilities', () => {
      assertRequiredArrayParam('capabilities', () => validateRunOptions({
        credentials: {cloud: '*', securityToken: '*'},
        tests: {
          path: '*',
          specsExt: '*'
        },
        capabilities: [],
        reporting: {}
      }), false, '');
    });
    it('should throw exception for empty credentials.cloud', () => {
      assertEmptyStringParam('credentials.cloud', () => validateRunOptions({
        credentials: {cloud: '', securityToken: '*'},
        tests: {
          path: '*',
          specsExt: '*'
        },
        capabilities: [{}],
        reporting: {}
      }));
    });
    it('should throw exception for empty credentials.securityToken', () => {
      assertEmptyStringParam('credentials.securityToken', () => validateRunOptions({
        credentials: {cloud: '*', securityToken: ''},
        tests: {
          path: '*',
          specsExt: '*'
        },
        capabilities: [{}],
        reporting: {}
      }));
    });
  });
});
