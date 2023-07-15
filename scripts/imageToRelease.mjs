import {spawnSync} from 'node:child_process';
import {getVersion} from './util/getVersion.mjs';
import pushFileToDraftRelease from './githubRelease/pushFileToDraftRelease.mjs';

const version = getVersion();
const outputFilename = `tpr-generator_${version}.tar`;

console.log(`imageToRelease, version is "${version}".`);

// Save image to file.
spawnSync('docker', ['save', `tpr-generator:${version}`, '-o', outputFilename], {
  stdio: 'inherit',
});

// Upload file to release.
pushFileToDraftRelease(outputFilename);
