// const fs = require('node:fs');
// const path = require('node:path');
// const { execSync, spawnSync } = require('node:child_process');
// const envFromYaml = require('./util/envFromYaml');
import {spawnSync} from 'node:child_process';
import getRootDir from './util/getRootDir.mjs';
import {prepareWebsiteEnv, applyEnv} from './prepareEnv.mjs';
import {getVersion} from './util/getVersion.mjs';

const rootDir = getRootDir();
// const rootDir = searchUpFileTree(__dirname, (currPath) =>
//   fs.existsSync(path.join(currPath, '.env'))
// );
// const stackFilePath = path.join(rootDir, 'stack.yml');

// require('dotenv').config({path: path.join(rootDir, '.env')});

// envFromYaml(stackFilePath);

applyEnv(prepareWebsiteEnv({imageVersion: getVersion()}));

spawnSync('docker', ['compose', 'build'], {
  stdio: 'inherit',
  cwd: rootDir,
  env: process.env,
});
