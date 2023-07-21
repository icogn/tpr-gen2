import path from 'node:path';
import fs from 'fs-extra';
import {spawnSync} from 'node:child_process';
import getRootDir from './util/getRootDir.mjs';
import {applyEnv, prepareDeployEnv} from './prepareEnv.mjs';
import yargs from 'yargs';
import semver from 'semver';
import singleImageWithTagExists from './util/docker/singleImageWithTagExists.mjs';
import loadImageFromGithub from './deployment/loadImageFromGithub.mjs';
import findContainerForChannelKey from './util/docker/findSingleContainerForChannelKey.mjs';
import getChannelKeyFromVersion from './util/getChannelKeyFromVersion.mjs';
import {getVersion} from './util/getVersion.mjs';
import {
  stopContainerById,
  rmContainerById,
  rmImageByTagIfExists,
} from './util/docker/runDockerCommand.mjs';
import getYarnCommand from './util/getYarnCommand.mjs';
import envFromYaml from './deployment/envFromYaml.mjs';

const {argv} = yargs(process.argv.slice(2))
  .option('image-version', {
    alias: 'i',
    describe: 'image version to deploy',
  })
  .option('replace', {
    alias: 'r',
    describe: 'stop active container of same channel',
    type: 'boolean',
    default: true,
  })
  .option('fetch', {
    alias: 'f',
    describe: 'fetch the image from github',
    type: 'boolean',
    default: false,
  })
  .option('from-service', {
    describe: 'for service use only. only it sets this to true',
    type: 'boolean',
    default: false,
  })
  .option('swarm', {
    describe: 'use swarm deploy',
    type: 'boolean',
    default: false,
  })
  .check(argv => {
    if (argv.imageVersion && !semver.parse(argv.imageVersion)) {
      throw new Error(`Semver failed to parse imageVersion "${argv.imageVersion}".`);
    }
    if (argv.fetch && !argv.imageVersion) {
      throw new Error('"fetch" option can only be used when "image-version" is also provided.');
    }
    return true;
  })
  .help();

const rootDir = getRootDir();
const tmpDir = argv.fromService
  ? path.join(rootDir, 'tmp/deployFromService')
  : path.join(rootDir, 'tmp/deployNormal');

// Clean up all old files.
fs.ensureDirSync(tmpDir);
fs.emptyDirSync(tmpDir);

// If should fetch, do fetch procedure
if (argv.fetch) {
  await loadImageFromGithub(argv.imageVersion, tmpDir);
}

// If specified an imageVersion, ensure it exists by this point. If didn't
// specify an image version, we will build the current one.
if (argv.imageVersion && !singleImageWithTagExists(argv.imageVersion)) {
  throw new Error(
    `Attempted to deploy image "tpr-generator:${argv.imageVersion}", but was unable to find the image to deploy.`,
  );
}

const version = argv.imageVersion || getVersion();

// Stop an existing container if there is exactly one to stop.
if (argv.replace) {
  const channelKey = getChannelKeyFromVersion(version);
  const {numContainers, containerInfo} = findContainerForChannelKey(channelKey);
  if (numContainers >= 2) {
    throw new Error(
      `"replace" is true, but there are 2 or more (${numContainers}) containers for the "${channelKey}" channel. Cannot know which one to replace.`,
    );
  }
  if (containerInfo) {
    const {containerId} = containerInfo;
    const stopped = stopContainerById(containerId);
    if (!stopped) {
      throw new Error(`Stopping docker container "${containerId}" has a non-zero exit code.`);
    }
    const removed = rmContainerById(containerId);
    if (!removed) {
      throw new Error(`Removing docker container "${containerId}" has a non-zero exit code.`);
    }
  }
}

// If deploying and imageVersion was not specified, then we should delete the
// image and rebuild it.
if (!argv.imageVersion) {
  const success = rmImageByTagIfExists(version);
  if (!success) {
    throw new Error(`Removing docker image tagged "${version}" has a non-zero exit code.`);
  }

  // Build the image
  const result = spawnSync(getYarnCommand(), ['image'], {
    stdio: 'inherit',
  });
  if (result.status !== 0) {
    throw new Error(`Failed to build image. ${result.stderr.toString()}`);
  }
}

// TODO: should call yarn image to build the image so everything is in one place.

const stackFilePath = path.join(rootDir, 'compose.yml');

// require('dotenv').config({path: path.join(rootDir, '.env')});

envFromYaml(stackFilePath);

// Probably will want to have the envFromYaml stuff in the prepareDeployEnv once
// start using it for secrets and configs
applyEnv(prepareDeployEnv({imageVersion: version}));

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
  process.env.HOST_PORT = 2999;

  spawnSync('docker', ['compose', '-f', stackFilePath, 'up', '-d'], {
    stdio: 'inherit',
    // cwd: path.join(__dirname, '..'),
    cwd: rootDir,
  });

  console.log('deployyy non-swarm');
}
