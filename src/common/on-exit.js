const sdkPackage = require('../../package.json');

const sdkDetails = (statusCode) => {
  console.log(`${sdkPackage.name} Version: ${sdkPackage.version} status code:`, statusCode);
};

process.on('beforeExit', sdkDetails);
