import path from 'node:path';
import getImageStackHash from '../githubRelease/getImageStackHash.mjs';
import downloadFile from '../imageUpdateService/downloadFile.mjs';
import getChannelLatestReleaseInfo from '../imageUpdateService/getChannelLatestReleaseInfo.mjs';
import getChannelKeyFromVersion from '../util/getChannelKeyFromVersion.mjs';
import {loadDockerImage} from '../util/docker/runDockerCommand.mjs';

function getAssetIfValid(release) {
  const imageStackHash = getImageStackHash();
  for (const asset of release.assets) {
    if (asset.name.startsWith('tpr-generator_') && asset.name.endsWith(`_${imageStackHash}.tar`)) {
      return asset;
    }
  }
  return null;
}

async function loadImageFromGithub(version, tmpDir) {
  // TODO: need to get owner and repo from static github API
  const latestReleaseInfo = await getChannelLatestReleaseInfo({
    owner: 'icogn',
    repo: 'tpr-gen2',
    channelKey: getChannelKeyFromVersion(version),
    exactVersion: version,
  });

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
