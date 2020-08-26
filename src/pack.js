import archiver from 'archiver';
import path from 'path';
import fs from 'fs';
import { zipFileName } from './common/consts';

const globalIgnorePatterns = [
  '**/node_modules/**'
];

export default async (pathRegex, ignoreRegexList, outPath) => {
  const zipArchive = archiver('zip', {});

  const zipFilePath = path.normalize(outPath + '/' + DEFAULT_ARCHIVE_FILE_NAME);
  const output = fs.createWriteStream(zipFilePath);

// listen for all archive data to be written
// 'close' event is fired only when a file descriptor is involved
  output.on('close', function () {
    console.log('Archive size:', zipArchive.pointer(), 'total bytes');
    console.log(zipFilePath);
  });

  // This event is fired when the data source is drained no matter what was the data source.
  // It is not part of this library but rather from the NodeJS Stream API.
  // @see: https://nodejs.org/api/stream.html#stream_event_end
  output.on('end', function () {
    console.log('Data has been drained');
  });

  // good practice to catch warnings (ie stat failures and other non-blocking errors)
  zipArchive.on('warning', function (err) {
    if (err.code === 'ENOENT') {
      console.warn(err);
    } else {
      console.warn(err);
      throw err;
    }
  });

// good practice to catch this error explicitly
  zipArchive.on('error', function (err) {
    throw err;
  });

  zipArchive.on('entry', function (entry) {
    console.info(entry.name); // TODO: (Elhay) print only for log level verbose
  });

// pipe archive data to the file
  zipArchive.pipe(output);

  zipArchive.glob(pathRegex, {ignore: [...ignoreRegexList, ...globalIgnorePatterns]});


  await zipArchive.finalize();
  return zipFilePath;
};
