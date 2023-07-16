import path from 'node:path';
import getGitCommitHash from './util/getGitCommitHash.mjs';
import getChannelString from './util/getChannelString.mjs';
import getRootDir from './util/getRootDir.mjs';
import {getVersion} from './util/getVersion.mjs';

export function prepareWebsiteEnv() {
  // Root volume path is always the same when starting the development next
  // server from this file.
  let rootVolumePath;
  if (process.env.NODE_ENV === 'development') {
    const rootDir = getRootDir();
    rootVolumePath = path.join(rootDir, 'volume');
  } else {
    rootVolumePath = '/app/volume';
  }
  const channel = getChannelString();

  const channelVolumePath = path.join(rootVolumePath, channel);

  return {
    TPR_GIT_COMMIT: getGitCommitHash(),
    TPR_ROOT_VOLUME_PATH: rootVolumePath,
    // TPR_CHANNEL: getChannelString(),
    TPR_CHANNEL_VOLUME_PATH: channelVolumePath,
    DATABASE_URL: 'file:' + path.join(channelVolumePath, 'db/app.db'),
  };
}

export function prepareDeployEnv(optionsIn) {
  const options = optionsIn || {};

  return {
    ...prepareWebsiteEnv(),
    IMAGE_VERSION: options.imageVersion || getVersion(),
  };
}

export function prepareElectronEnv() {
  return {
    TPR_GIT_COMMIT: getGitCommitHash(),
  };
}

export function applyEnv(envObj) {
  if (!envObj || typeof envObj !== 'object') {
    return;
  }

  Object.keys(envObj).forEach(key => {
    process.env[key] = envObj[key];
  });
}

export function createEnvFileContents(envObj) {
  if (!envObj || typeof envObj !== 'object') {
    return '';
  }

  let content = '';
  Object.keys(envObj).forEach(key => {
    content += `${key}=${String(envObj[key])}`;
  });
  return content;
}
