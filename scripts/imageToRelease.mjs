import {spawnSync} from 'node:child_process';
import {getVersion} from './util/getVersion.mjs';
import pushFileToDraftRelease from './githubRelease/pushFileToDraftRelease.mjs';
import getImageStackHash from './githubRelease/getImageStackHash.mjs';

const version = getVersion();
const stackHash = getImageStackHash();
const outputFilename = `tpr-generator_${version}_${stackHash}.tar`;

console.log(`imageToRelease, version is "${version}".`);

// Save image to file.
spawnSync('docker', ['save', `tpr-generator:${version}`, '-o', outputFilename], {
  stdio: 'inherit',
});

// Upload file to release.
pushFileToDraftRelease(outputFilename);

// TODO: remove other tar files which do not match the `outputFilename`
