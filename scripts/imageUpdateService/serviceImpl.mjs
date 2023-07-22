import {spawnSync} from 'node:child_process';
import semver from 'semver';
import getChannelLatestReleaseInfo from './getChannelLatestReleaseInfo.mjs';
import getYarnCommand from '../util/getYarnCommand.mjs';
import findContainerForChannelKey from '../util/docker/findSingleContainerForChannelKey.mjs';

// const minuteMs = 60 * 1000;

let logEvent = () => {
  // do nothing
};

async function processChannelKey(channelKey) {
  // Service only replaces containers; it does not deploy one if there is not
  // already one deployed or if there are multiple so we do not know which one
  // to replace.
  const {containerInfo} = findContainerForChannelKey(channelKey);
  if (!containerInfo) {
    return;
  }

  // TODO: don't use hardcoded info for the input to this.

  // TODO: should minimize the calls in the below since there is a 60 per hour
  // rate limit by IP for non-authenticated.

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
    logEvent('should replace');

    const result = spawnSync(getYarnCommand(), [
      'deploy',
      '--from-service',
      '-f',
      '-i',
      latestReleaseInfo.version,
    ]);
    if (result.status == null) {
      logEvent(
        'Tried to run yarn, but result.status was null. yarn is likely not available in the PATH environment variable.',
      );
      return;
    } else if (result.status === 0) {
      logEvent('Ran deploy command with exit code 0');
    }
  } else {
    console.log('does not need to replace');
    logEvent('does not need to replace');
  }
}

async function doServiceIteration() {
  console.log('\nDoing iteration');

  const channelKey = 'dev';

  // TODO: fetch centralized channel config once up-front.

  try {
    await processChannelKey(channelKey);
  } catch (e) {
    // We base64 encode the error message since it will fail to log otherwise.
    // It appears no escaping is done on the input, but handling escaping
    // yourself is considered a bad idea.
    console.error(e);
    logEvent(
      `Caught error at top level (base64-encoded):\n${Buffer.from(e.message).toString('base64')}`,
    );
  }

  // setTimeout(doServiceIteration, 5 * minuteMs);
  setTimeout(doServiceIteration, 10_000);
}

async function prepareLogger() {
  if (!process.env.TPR_IS_SERVICE) {
    // Do not prepare the logger if not in the service
    return;
  }

  if (process.platform === 'win32') {
    const nodeWindows = await import('node-windows');

    const eventLog = new nodeWindows.EventLogger({
      source: 'TprGen Updater Service',
    });

    logEvent = str => {
      eventLog.info(str);
    };
  }
}

async function main() {
  await prepareLogger();
  doServiceIteration();
}

main();
