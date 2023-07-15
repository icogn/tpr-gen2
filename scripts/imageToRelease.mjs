import {spawnSync} from 'node:child_process';
import getRootDir from './util/getRootDir.mjs';
import {getVersion} from './util/getVersion.mjs';

const rootDir = getRootDir();
const version = getVersion();

console.log(`imageToRelease, version is "${version}".`);

spawnSync('docker', ['save', `tpr-generator:${version}`, '-o', 'tpr-generator_version'], {
  stdio: 'inherit',
  cwd: rootDir,
});

// Save image to file.

// temp: print size of file

// Upload file to release.
