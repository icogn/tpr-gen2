// import {EventLogger} from 'node-windows';
import fs from 'fs-extra';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import semver from 'semver';
// import getChannelInfo from './getChannelInfo.mjs';
import getChannelLatestReleaseInfo from './getChannelLatestReleaseInfo.mjs';
import getRootDir from '../util/getRootDir.mjs';
// import getImageStackHash from '../githubRelease/getImageStackHash.mjs';
// import downloadFile from './downloadFile.mjs';

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
    if (parsed) {
      if (ret) {
        // Act as if there is nothing to do if we find multiple running containers
        // for this channels since we don't know which one to replace.
        return null;
      } else {
        ret = parsed;
      }
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

async function main() {
  const channelKey = 'dev';

  const container = findContainerForChannelKey(channelKey);
  if (!container) {
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

  if (semver.gt(latestReleaseInfo.version, container.imageVersion)) {
    console.log('should replace');
    await tryReplaceContainer({container, latestReleaseInfo});
  } else {
    console.log('does not need to replace');
    return;
  }

  // Check if latestRelease is a newer version than our current

  // const a = await getChannelInfo();
  // console.log(a);

  const channelsToCheck = ['dev'];

  for (let i = 0; i < channelsToCheck.length; i++) {
    const channelKey = channelsToCheck[i];
    doWork(channelKey);
  }
}

async function tryReplaceContainer({container, latestReleaseInfo}) {
  console.log(latestReleaseInfo);
  const rootDir = getRootDir();
  const tmpDir = path.join(rootDir, 'tmp');

  // Clean up all old files.
  fs.ensureDirSync(tmpDir);
  // fs.emptyDirSync(tmpDir);

  // const asset = getAssetIfValid(latestReleaseInfo.release);
  // console.log(asset);

  // const downloadResult = await downloadFile(asset.browser_download_url, tmpDir);
  // if (downloadResult.downloadStatus != 'COMPLETE') {
  //   // fail
  //   throw new Error(
  //     `Failed to download file. downloadStatus is "${downloadResult.downloadStatus}".`,
  //   );
  // }
  // console.log('a');

  // Temp, so we don't spam github with a ton of downloads in a row while
  // testing.
  const imagePath = path.join(tmpDir, 'tpr-generator_1.1.5-dev.35_60ae946a.tar');

  const loadedImage = loadDockerImage(imagePath);
  if (!loadedImage) {
    throw new Error(`Failed to load docker image at path "${imagePath}".`);
  }

  // Stop current container
  stopDockerContainer(container.containerId);

  runDeploy();

  //
  // Check that image from github is supported in terms of deploy hash. Bail if
  // not compatible. Some way to alert this from service?
  //
  // If compatible, download the image from github. If fail, then just fails.
  //
  // Load downloaded image. If fails, it fails.
  //
  // If success, stop current container. If fails, it fails.
  //
  // Deploy the new container passing the imageVersion as an arg.
}

// function getAssetIfValid(release) {
//   const imageStackHash = getImageStackHash();
//   for (const asset of release.assets) {
//     if (asset.name.startsWith('tpr-generator_') && asset.name.endsWith(`_${imageStackHash}.tar`)) {
//       return asset;
//     }
//   }
//   return null;
// }

function loadDockerImage(imagePath) {
  const result = spawnSync('docker', ['load', '-i', imagePath]);
  return result.status === 0;
}

function stopDockerContainer(containerId) {
  const result = spawnSync('docker', ['stop', containerId]);
  return result.status === 0;
}

function runDeploy() {
  console.log('runDeploy');
}

main();
