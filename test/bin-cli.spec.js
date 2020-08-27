import child_process from 'child_process';
import { expect } from 'chai';
import { objectToCliOptions } from './util/cli-util';

const CLI_EXEC_TIMEOUT = 5000;
const babelExec = 'npx babel-node --presets @babel/preset-env ';

const execCliCommand = (command='', params={}) => {
  const paramsString = objectToCliOptions(params);

  return child_process.execSync(
    babelExec + 'src/bin.js ' + command + paramsString,
    {stdio : 'pipe' }
  ).toString()
}

describe('bin - cli', () => {
  it('[sanity] add +x permissions to mock-bin file', () => {
    child_process.execSync('chmod +x src/bin.js');
  });

  it('should throw error if command not provided', () => {
    try {
      execCliCommand();
      expect.fail('execute should failed without command');
    } catch (error) {
      expect(error.message).contain('You need at least one command before moving on');
    }
  }).timeout(CLI_EXEC_TIMEOUT);

  describe('help menu', () => {
  });
});
