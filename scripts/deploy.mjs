import path from 'node:path';
import {spawnSync} from 'node:child_process';
import getRootDir from './util/getRootDir.mjs';
import {applyEnv, prepareDeployEnv} from './prepareEnv.mjs';
import yargs from 'yargs';
import semver from 'semver';
import singleImageWithTagExists from './util/docker/singleImageWithTagExists.mjs';
// import envFromYaml from './util/envFromYaml';

const {argv} = yargs(process.argv.slice(2))
  .option('image-version', {
    alias: 'i',
    describe: 'run your program',
  })
  .check(argv => {
    if (argv.imageVersion && !semver.parse(argv.imageVersion)) {
      throw new Error(`Semver failed to parse imageVersion "${argv.imageVersion}".`);
    }
    return true;
  })
  .option('swarm', {
    describe: '',
    type: 'boolean',
    default: false,
  })
  .help();

if (argv.imageVersion && !singleImageWithTagExists(argv.imageVersion)) {
  throw new Error(
    `Attempted to deploy image "tpr-generator:${argv.imageVersion}", but was unable to find the image to deploy.`,
  );
}

const rootDir = getRootDir();

const stackFilePath = path.join(rootDir, 'compose.yml');

// require('dotenv').config({path: path.join(rootDir, '.env')});

// envFromYaml(stackFilePath);

// Probably will want to have the envFromYaml stuff in the prepareDeployEnv once
// start using it for secrets and configs
applyEnv(prepareDeployEnv({imageVersion: argv.imageVersion}));

// Not using swarm until test it.
// eslint-disable-next-line no-constant-condition
if (false && argv.swarm) {
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
