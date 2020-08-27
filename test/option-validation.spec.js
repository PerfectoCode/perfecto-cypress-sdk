import { expect } from "chai";
import { validatePackOptions } from '../src/common/option-validation';

describe('Parameters validation', () => {
  describe('Pack command', () => {
    it('should throw exception without required param: ignoreRegexList', async () => {
      try {
        validatePackOptions('test/resources/**');
        expect.fail('execute should failed without required parameter ignoreRegexList');
      } catch (error) {
        expect(error.message).to.be.eq('Invalid arrayOrEmpty value: undefined\nArgument Name: ignoreRegexList | tests.ignore');
      }
    });

    it('should throw exception without required param: pathRegex', async () => {
      try {
        validatePackOptions();
        expect.fail('execute should failed without required parameter pathRegex');
      } catch (error) {
        expect(error.message).to.be.eq('Invalid string value: undefined\nArgument Name: pathRegex | tests.path');
      }
    });
    it('should throw exception without required param: ignore', async () => {
      try {
        validatePackOptions('foo');
        expect.fail('execute should failed without required parameter ignore');
      } catch (error) {
        expect(error.message).to.be.eq('Invalid arrayOrEmpty value: undefined\nArgument Name: ignoreRegexList | tests.ignore');
      }
    });

    it('should throw exception for empty pathRegex', async () => {
      try {
        validatePackOptions('', [], '');
        expect.fail('execute should failed without required parameter pathRegex');
      } catch (error) {
        expect(error.message).to.be.eq('Invalid string value: \nArgument Name: pathRegex | tests.path');
      }
    });
    it('should not throw exception for empty ignoreRegexList', async () => {
      try {
        validatePackOptions('foo', [], 'bar');
      } catch (error) {
        expect.fail('ignoreRegexList should be optional');
      }
    });
    it('should throw exception for empty outPath', async () => {
      try {
        validatePackOptions('foo', ['bar'], '');
        expect.fail('execute should failed without required parameter outPath');
      } catch (error) {
        expect(error.message).to.be.eq('Invalid string value: \nArgument Name: outPath');
      }
    });
  })
});
