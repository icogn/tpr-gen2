import fs from 'fs-extra';
// import {spawnSync} from 'node:child_process';
// import getRootDir from './util/getRootDir.mjs';
import {getVersion} from './util/getVersion.mjs';

// const rootDir = getRootDir();
const version = getVersion();
// const outputFilename = `tpr-generator_${version}`;
const outputFilename = 'exampleImage.txt';

console.log(`imageToRelease, version is "${version}".`);

// Save image to file.
// spawnSync('docker', ['save', `tpr-generator:${version}`, '-o', outputFilename], {
//   stdio: 'inherit',
//   cwd: rootDir,
// });

const stats = fs.statSync(outputFilename);
const fileSizeInBytes = stats.size;
console.log(`fileSizeInBytes: ${fileSizeInBytes}B`);
// // Convert the file size to megabytes (optional)
// const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
// console.log(`fileSizeInMegabytes: ${fileSizeInMegabytes}MB`);

// temp: print size of file

// Upload file to release.
