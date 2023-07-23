import {spawnSync} from 'node:child_process';
import semver from 'semver';
import getChannelLatestReleaseInfo from './getChannelLatestReleaseInfo.mjs';
import getYarnCommand from '../util/getYarnCommand.mjs';
import findContainerForChannelKey from '../util/docker/findSingleContainerForChannelKey.mjs';
import fetchChannels from '../util/fetch/fetchChannels.mjs';
import getRootDir from '../util/getRootDir.mjs';

const rootDir = getRootDir();

let logEvent = () => {
  // do nothing
};

async function processChannel({owner, repo, channelKey}) {
  // Service only replaces containers; it does not deploy one if there is not
  // already one deployed or if there are multiple so we do not know which one
  // to replace.
  const {containerInfo} = findContainerForChannelKey(channelKey);
  if (!containerInfo) {
    return;
  }

  const latestReleaseInfo = await getChannelLatestReleaseInfo({
    owner: owner,
    repo: repo,
    channelKey: channelKey,
  });

  console.log(latestReleaseInfo);
  if (!latestReleaseInfo) {
    return;
  }

  if (semver.gt(latestReleaseInfo.version, containerInfo.imageVersion)) {
    logEvent(`should replace to tag "${latestReleaseInfo.version}"`);

    const result = spawnSync(
      getYarnCommand(),
      ['deploy', '--from-service', '-f', '-i', latestReleaseInfo.version],
      {
        stdio: 'inherit',
        cwd: rootDir,
      },
    );
    if (result.status == null) {
      logEvent(
        'Tried to run yarn, but result.status was null. yarn is likely not available in the PATH environment variable.',
      );
    } else if (result.status === 0) {
      logEvent(`Ran deploy command with exit code 0 for tag "${latestReleaseInfo.version}"`);
    }
  } else {
    console.log(`does not need to replace "${channelKey}"`);
  }
}

async function doServiceIteration() {
  console.log('Doing iteration');

  const channelsConfig = await fetchChannels();
  const channelKeys = Object.keys(channelsConfig);

  for (let i = 0; i < channelKeys.length; i++) {
    const channelKey = channelKeys[i];
    try {
      await processChannel({...channelsConfig[channelKey], channelKey});
    } catch (e) {
      // We base64 encode the error message since it will fail to log otherwise.
      // It appears no escaping is done on the input, but handling escaping
      // yourself is considered a bad idea.
      console.error(e);
      logEvent(
        `Caught error at top level (base64-encoded):\n${Buffer.from(e.message).toString('base64')}`,
      );
    }
  }

  logEvent('Iteration done');
  console.log('Iteration done');

  setTimeout(doServiceIteration, 5 * 60_000);
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
  } else {
    logEvent = str => {
      console.log(str);
    };
  }
}

async function main() {
  await prepareLogger();
  doServiceIteration();
}

main();
