import path from 'path';
import fs from 'fs';
import AdmZip from 'adm-zip';
import { expect } from 'chai';

import packCommand from '../src/pack';
import { DEFAULT_ARCHIVE_FILE_NAME } from '../src/common/defaults';

describe('Pack', () => {
  let outPath;
  const createUniqueOutPath = () => 'test/temp/' + new Date().getTime();
  afterEach(() => {
    if (!outPath) {
      return;
    }
    fs.unlinkSync(path.resolve(outPath, DEFAULT_ARCHIVE_FILE_NAME));
    fs.rmdir(path.resolve(outPath), (error) => {
      if (error) {
        console.error('Clean failed:', error);
      }
    });
    outPath = null;
  });

  it('should create outPath if not exist', async () => {
    outPath = createUniqueOutPath();
    await packCommand('test/resources/archive-files/', [], outPath);
    expect(fs.existsSync(outPath), 'outPath: ' + outPath + ', not exist').to.be.true;
  });

  it('should include all files without predefined ignored files', async () => {
    outPath = createUniqueOutPath();
    await packCommand('test/resources/archive-files/', [], outPath);

    const admZip = new AdmZip(path.resolve(outPath, DEFAULT_ARCHIVE_FILE_NAME));
    const zipFiles = admZip.getEntries().map(i => i.entryName);

    expect(zipFiles).to.not.contain('node_modules/excluded-by-default.txt');
    expect(zipFiles).to.not.contain('perfecto-cypress.zip');
  });

  it('should exclude ignoredRegexList files', async () => {
    outPath = createUniqueOutPath();
    await packCommand('test/resources/archive-files/', ['test-file[1-9].text'], outPath);

    const admZip = new AdmZip(path.resolve(outPath, DEFAULT_ARCHIVE_FILE_NAME));
    const zipFiles = admZip.getEntries().map(i => i.entryName);

    expect(zipFiles).to.not.contain('test-file2.text');
  });

  it('should throw exception if testRoot is an empty folder', async () => {
    await expect(
      packCommand('test/resources/empty', [], 'test/temp')
    ).to.be.rejectedWith('Zip archive contain zero files');
  });

  it('should throw exception if archive is empty', async () => {
    outPath = createUniqueOutPath();
    await expect(
      packCommand('test/resources/archive-files', ['**/**'], outPath)
    ).to.be.rejectedWith('Zip archive contain zero files');
  });
});
