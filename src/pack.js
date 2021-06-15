import archiver from 'archiver';
import path from 'path';
import fs from 'fs';
import { DEFAULT_ARCHIVE_FILE_NAME } from './common/defaults';
import { validatePackOptions } from './common/option-validation';
import { getIgnoredFiles } from './common/utils';

export default (testsRoot, ignoreRegexList = [], outPath) => new Promise((resolve, reject) => {
  validatePackOptions(testsRoot, ignoreRegexList, outPath);

  const zipArchive = archiver('zip', {});

  const zipFilePath = path.resolve(outPath, DEFAULT_ARCHIVE_FILE_NAME);
  if(!fs.existsSync(path.resolve(outPath))) {
    fs.mkdirSync(path.resolve(outPath), {recursive: true});
  }
  const output = fs.createWriteStream(zipFilePath);

  // This event is fired when the data source is drained no matter what was the data source.
  // It is not part of this library but rather from the NodeJS Stream API.
  // @see: https://nodejs.org/api/stream.html#stream_event_end
  output.on('finish', function () {
    if (zipArchive.pointer() === 22) {
      reject(new Error('Zip archive contain zero files'));
    }
    console.log('Archive size:', zipArchive.pointer(), 'total bytes');
    console.log(zipFilePath);

    resolve(zipFilePath);
  });

  // good practice to catch warnings (ie stat failures and other non-blocking errors)
  zipArchive.on('warning', function (err) {
    if (err.code === 'ENOENT') {
      console.warn(err);
    } else {
      reject(err);
    }
  });

// good practice to catch this error explicitly
  zipArchive.on('error', function (err) {
    reject(err);
  });

  zipArchive.on('entry', function (entry) {
    console.info(entry.name); // TODO: (Elhay) print only for log level verbose
  });

// pipe archive data to the file
  zipArchive.pipe(output);

  zipArchive.glob('**/+([!.]*|.npmrc)', {
    matchBase: true,
    cwd: testsRoot,
    dot:true,
    ignore: getIgnoredFiles(ignoreRegexList)
  });

  zipArchive.finalize();
});
