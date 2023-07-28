import path from 'node:path';
import getGitCommitHash from './getGitCommitHash.mjs';
import getRootDir from './getRootDir.mjs';
import {getVersion} from './getVersion.mjs';

function asLinuxPath(inputPath) {
  return inputPath.replace(/\\/g, '/');
}

export function prepareWebsiteEnv({imageVersion}) {
  if (!imageVersion) {
    throw new Error('imageVersion provided to prepareWebsiteEnv was falsy.');
  }

  // Root volume path is always the same when starting the development next
  // server from this file.
  let rootVolumePath;
  if (process.env.NODE_ENV === 'development') {
    const rootDir = getRootDir();
    rootVolumePath = path.join(rootDir, 'volume');
  } else {
    rootVolumePath = '/app/volume';
  }

  return {
    TPR_GIT_COMMIT: getGitCommitHash(),
    TPR_IMAGE_VERSION: imageVersion,
    TPR_ROOT_VOLUME_PATH: asLinuxPath(rootVolumePath),
  };
}

export function prepareDeployEnv(optionsIn) {
  const options = optionsIn || {};
  options.imageVersion = options.imageVersion || getVersion();

  return {
    ...prepareWebsiteEnv(options),
  };
}

// These env variables are forwarded to the website from electron. We leave some
// out since they will be calculated by electron and then provided to the
// website. For example, electron determines the volume path and passes that
// info to the website.
export function prepareElectronEnv() {
  return {
    TPR_GIT_COMMIT: getGitCommitHash(),
    TPR_IMAGE_VERSION: getVersion(),
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
    content += `${key}=${String(envObj[key])}\n`;
  });
  return content;
}
