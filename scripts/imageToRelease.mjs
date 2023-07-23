import {spawnSync} from 'node:child_process';
import {getVersion} from './util/getVersion.mjs';
import updateDraftReleaseTars from './githubRelease/updateDraftReleaseTars.mjs';
import getImageStackHash from './githubRelease/getImageStackHash.mjs';

const version = getVersion();
const stackHash = getImageStackHash();
const outputFilename = `tpr-generator_${version}_${stackHash}.tar`;

console.log(`imageToRelease, version is "${version}".`);

// Save image to file.
spawnSync('docker', ['save', `tpr-generator:${version}`, '-o', outputFilename], {
  stdio: 'inherit',
});

// Upload file to release and delete outdated tar files.
updateDraftReleaseTars(outputFilename);
