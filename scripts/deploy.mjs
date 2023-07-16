import path from 'node:path';
import {spawnSync} from 'node:child_process';
import getRootDir from './util/getRootDir.mjs';
import {applyEnv, prepareDeployEnv} from './prepareEnv.mjs';
// import envFromYaml from './util/envFromYaml';

// const rootDir = path.resolve(__dirname, '../..');
const rootDir = getRootDir();

// const stackFilePath = path.join(rootDir, 'stack.yml');
const stackFilePath = path.join(rootDir, 'compose.yml');

// TODO: should do a check before trying to deploy if the image version already
// exists on the machine? And throw an error if it does? Local builds can use an
// epoch for the version?

// require('dotenv').config({path: path.join(rootDir, '.env')});

// envFromYaml(stackFilePath);

// Probably will want to have the envFromYaml stuff in the prepareDeployEnv once
// start using it for secrets and configs
applyEnv(prepareDeployEnv());

// let useSwarm = true;
let useSwarm = false;

const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--no-swarm') {
    useSwarm = false;
  }
}

if (useSwarm) {
  spawnSync('docker', ['stack', 'deploy', '-c', stackFilePath, 'demo'], {
    stdio: 'inherit',
    // cwd: path.join(__dirname, '..'),
    cwd: rootDir,
  });
  console.log('deployyy');
} else {
  process.env.HOST_PORT = 80;

  spawnSync('docker', ['compose', '-f', stackFilePath, 'up', '-d'], {
    stdio: 'inherit',
    // cwd: path.join(__dirname, '..'),
    cwd: rootDir,
  });

  console.log('deployyy non-swarm');
}
