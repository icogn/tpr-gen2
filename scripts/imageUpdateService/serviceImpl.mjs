// import {EventLogger} from 'node-windows';
import {spawnSync} from 'node:child_process';
import semver from 'semver';

// const log = new EventLogger({
//   source: 'My Event Log',
//   // eventLog: 'SYSTEM',
// });

// log.info(`Log from the serviceImpl.mjs: ${process.env.TPR_ARGS}`);

// setInterval(() => {
//   console.log('inside serviceImpl');
// }, 10000);

// const args = 'dev';

function parseContainerLine(line, desiredChannelKey) {
  const reg = /([0-9a-f]+)\s+(tpr-generator:([a-z0-9:.\-_]+))/i;

  const match = line.match(reg);
  if (!match) {
    return null;
  }

  const imageVersion = match[3];

  if (semver.parse(imageVersion) == null) {
    return null;
  }

  const prerelease = semver.prerelease(imageVersion);

  if (
    (prerelease == null && desiredChannelKey === 'stable') ||
    desiredChannelKey === prerelease[0]
  ) {
    return {
      containerId: match[1],
      image: match[2],
      imageVersion: match[3],
    };
  }

  return null;
}

function findContainerForChannelKey(channelKey) {
  const result = spawnSync('docker', ['ps']);
  const output = result.stdout.toString();

  if (!output.startsWith('CONTAINER ID')) {
    return null;
  }

  const lines = output.split(/[\r\n]+/);

  let ret = null;

  for (let i = 1; i < lines.length; i++) {
    const parsed = parseContainerLine(lines[i], channelKey);
    if (ret) {
      // Act as if there is nothing to do if we find multiple running containers
      // for this channels since we don't know which one to replace.
      return null;
    } else {
      ret = parsed;
    }
  }

  return ret;
}

function doWork(channelKey) {
  const ret = findContainerForChannelKey(channelKey);
  if (!ret) {
    return;
  }

  // If there is a running container which we might replace, then we check to
  // see if there is an update.

  // Get latest version from github

  console.log(ret);
}

function main() {
  const channelsToCheck = ['dev'];

  for (let i = 0; i < channelsToCheck.length; i++) {
    const channelKey = channelsToCheck[i];
    doWork(channelKey);
  }
}

main();
