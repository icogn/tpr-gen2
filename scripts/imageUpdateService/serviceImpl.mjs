// import {EventLogger} from 'node-windows';
import {spawnSync} from 'node:child_process';
import semver from 'semver';
import getChannelLatestReleaseInfo from './getChannelLatestReleaseInfo.mjs';
import getYarnCommand from '../util/getYarnCommand.mjs';
import findContainerForChannelKey from '../util/docker/findSingleContainerForChannelKey.mjs';

const minuteMs = 60 * 1000;

// const log = new EventLogger({
//   source: 'My Event Log',
//   // eventLog: 'SYSTEM',
// });

// log.info(`Log from the serviceImpl.mjs: ${process.env.TPR_ARGS}`);

// setInterval(() => {
//   console.log('inside serviceImpl');
// }, 10000);

// const args = 'dev';

//

// Check for if there is a newer version.
// If there is, call deploy with fetch and that tag.

async function processChannelKey(channelKey) {
  // Service only replaces containers; it does not deploy one if there is not
  // already one deployed or if there are multiple so we do not know which one
  // to replace.
  const {containerInfo} = findContainerForChannelKey(channelKey);
  if (!containerInfo) {
    return;
  }

  const latestReleaseInfo = await getChannelLatestReleaseInfo({
    owner: 'icogn',
    repo: 'tpr-gen2',
    channelKey,
  });
  console.log(latestReleaseInfo);
  if (!latestReleaseInfo) {
    return;
  }

  if (semver.gt(latestReleaseInfo.version, containerInfo.imageVersion)) {
    console.log('should replace');
    // await tryReplaceContainer({containerInfo, latestReleaseInfo});

    // Run deploy
    spawnSync(getYarnCommand(), [
      'deploy',
      '--from-service',
      '-f',
      '-i',
      latestReleaseInfo.version,
    ]);
  } else {
    console.log('does not need to replace');
  }
}

async function doServiceIteration() {
  console.log('Doing iteration');

  const channelKey = 'dev';

  // TODO: fetch centralized channel config once up-front.

  console.log('before');
  try {
    await processChannelKey(channelKey);
  } catch (e) {
    console.error(e);
  }
  console.log('after\n');

  setTimeout(doServiceIteration, 5 * minuteMs);
}

async function main() {
  doServiceIteration();
}

main();
