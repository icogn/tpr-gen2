import path from 'node:path';
import getImageStackHash from '../githubRelease/getImageStackHash.mjs';
import downloadFile from '../imageUpdateService/downloadFile.mjs';
import getChannelLatestReleaseInfo from '../imageUpdateService/getChannelLatestReleaseInfo.mjs';
import getChannelKeyFromVersion from '../util/getChannelKeyFromVersion.mjs';
import {loadDockerImage} from '../util/docker/runDockerCommand.mjs';
import fetchChannelObj from '../util/fetch/fetchChannelObj.mjs';

function getAssetIfValid(release) {
  const imageStackHash = getImageStackHash();
  console.log(`imageStackHash:${imageStackHash}`);
  for (const asset of release.assets) {
    if (asset.name.startsWith('tpr-generator_') && asset.name.endsWith(`_${imageStackHash}.tar`)) {
      return asset;
    }
  }
  return null;
}

async function loadImageFromGithub(version, tmpDir) {
  const channelKey = getChannelKeyFromVersion(version);
  const channelObj = await fetchChannelObj(channelKey);
  if (!channelObj) {
    throw new Error(`fetchChannelObj return null for channelKey "${channelKey}".`);
  }
  const {owner, repo} = channelObj;
  if (!owner || !repo) {
    throw new Error(`owner or repo was falsy for channelKey "${channelKey}".`);
  }

  const latestReleaseInfo = await getChannelLatestReleaseInfo({
    owner,
    repo,
    channelKey,
    exactVersion: version,
  });
  if (!latestReleaseInfo) {
    throw new Error(
      `latestReleaseInfo for channelKey "${channelKey}" was null, but expected a value.`,
    );
  }

  // Check that image from github is supported in terms of deploy hash. Bail if
  // not compatible. Some way to alert this from service?
  const asset = getAssetIfValid(latestReleaseInfo.release);
  console.log(asset);
  if (!asset) {
    throw new Error(
      'Verification of imageStackHash to download asset failed, or asset was not found.',
    );
  }

  // If compatible, download the image from github. If fail, then just fails.
  const downloadResult = await downloadFile(asset.browser_download_url, tmpDir);
  if (downloadResult.downloadStatus != 'COMPLETE') {
    throw new Error(
      `Failed to download file. downloadStatus is "${downloadResult.downloadStatus}".`,
    );
  }

  const imagePath = path.join(tmpDir, asset.name);

  // Load downloaded image. If fails, it fails.
  const loadedImage = loadDockerImage(imagePath);
  if (!loadedImage) {
    throw new Error(`Failed to load docker image at path "${imagePath}".`);
  }
}

export default loadImageFromGithub;
