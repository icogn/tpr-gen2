// const fs = require('node:fs');
// const path = require('node:path');
// const { execSync, spawnSync } = require('node:child_process');
// const envFromYaml = require('./util/envFromYaml');
import path from 'node:path';
import fs from 'fs-extra';
import {spawnSync} from 'node:child_process';
import getRootDir from './util/getRootDir.mjs';
import {prepareWebsiteEnv, applyEnv} from './prepareEnv.mjs';
import {getVersion} from './util/getVersion.mjs';
import createWebsiteEnvFile from './createWebsiteEnvFile.mjs';
import envFromYaml from './deployment/envFromYaml.mjs';

const rootDir = getRootDir();
const rootPackageJson = path.join(rootDir, 'package.json');

function createTmpPackageJson() {
  // Leave these packages out since they are absolutely not needed for building
  // the docker image, and they can cause it to hang forever (probably electron
  // is what makes it hang, but we aren't running tests, so we don't need
  // playwright either).
  const packagesToLeaveOut = {
    electron: true,
    playwright: true,
  };

  const contents = fs.readJSONSync(rootPackageJson);
  contents.devDependencies = Object.keys(contents.devDependencies).reduce((acc, pkg) => {
    if (!packagesToLeaveOut[pkg]) {
      acc[pkg] = contents.devDependencies[pkg];
    }
    return acc;
  }, {});

  fs.writeFileSync(path.join(rootDir, 'tmp/package.json'), JSON.stringify(contents, null, 2));
  return contents;
}

createTmpPackageJson();

// const rootDir = searchUpFileTree(__dirname, (currPath) =>
//   fs.existsSync(path.join(currPath, '.env'))
// );
// const stackFilePath = path.join(rootDir, 'stack.yml');

// require('dotenv').config({path: path.join(rootDir, '.env')});

// envFromYaml(stackFilePath);

const stackFilePath = path.join(rootDir, 'compose.yml');
envFromYaml(stackFilePath);

applyEnv(prepareWebsiteEnv({imageVersion: getVersion()}));

createWebsiteEnvFile();

spawnSync('docker', ['compose', 'build'], {
  stdio: 'inherit',
  cwd: rootDir,
  env: process.env,
});
