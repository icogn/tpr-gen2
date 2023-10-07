import fs from 'node:fs';
import path from 'node:path';
import semver from 'semver';
import { EnvObject, JsonObject } from './dockerEntrypointTypes';

function asLinuxPath(inputPath: string) {
  return inputPath.replace(/\\/g, '/');
}

function validateInitialEnvObj(envObj: EnvObject) {
  if (!envObj || typeof envObj !== 'object') {
    throw new Error('envObj is not an object!');
  }

  if (!envObj.TPR_ROOT_VOLUME_PATH) {
    throw new Error('TPR_ROOT_VOLUME_PATH is missing!');
  }
}

function validateFinalEnvObj(finalEnvObj: EnvObject) {
  if (!finalEnvObj || typeof finalEnvObj !== 'object') {
    throw new Error('envObj is not an object!');
  }

  if (!finalEnvObj.TPR_CHANNEL_VOLUME_PATH) {
    throw new Error('TPR_CHANNEL_VOLUME_PATH is missing!');
  }
}

function getChannelKeyFromVersion(version: string) {
  if (semver.parse(version) == null) {
    throw new Error(`semver failed to parse "${version}".`);
  }

  const prerelease = semver.prerelease(version);
  if (prerelease == null) {
    return 'stable';
  }
  if (prerelease.length > 0) {
    const prerelease0 = prerelease[0];
    if (prerelease0 === 'stable') {
      throw new Error(
        `"stable" is reserved for a version with no prerelease. Provided version was "${version}".`,
      );
    } else if (!prerelease0) {
      throw new Error(
        `semver parsed prerelease, but index 0 was falsy. Provided version was "${version}".`,
      );
    }

    return String(prerelease[0]);
  }
  throw new Error(`semver parsed prerelease but has 0 length. Version was "${version}".`);
}

// Mutates envObj
function applyEnvValues(envObj: EnvObject, config: JsonObject, channelKey: string) {
  /* eslint-disable no-param-reassign */
  const validKeys: { [key: string]: boolean } = {
    NEXTAUTH_URL: true,
  };

  if (config.byChannelKey && config.byChannelKey[channelKey]) {
    const { env } = config.byChannelKey[channelKey];
    if (env && typeof env === 'object') {
      Object.keys(env).forEach(key => {
        if (validKeys[key]) {
          envObj[key] = env[key];
        }
      });
    }
  }
}

// Mutates envObj
function prepareVolumeAndEnv(envObj: EnvObject) {
  /* eslint-disable no-param-reassign */
  console.log('in prepareVolumeAndEnv');
  validateInitialEnvObj(envObj);

  const channelKey = getChannelKeyFromVersion(envObj.TPR_IMAGE_VERSION);
  console.log('channelKey:');
  console.log(channelKey);

  const config = JSON.parse(fs.readFileSync('/deploy_config').toString());
  console.log('config:');
  console.log(config);
  applyEnvValues(envObj, config, channelKey);

  const testingMigration = false;

  if (config.testMigration && config.testMigration.enabled) {
    console.log('testMigration is enabled.');
  }

  if (!testingMigration) {
    const channelVolumePath = path.join(envObj.TPR_ROOT_VOLUME_PATH, 'chn', channelKey);
    if (!fs.existsSync(channelVolumePath)) {
      fs.mkdirSync(channelVolumePath, { recursive: true });
    }
    envObj.TPR_CHANNEL_VOLUME_PATH = channelVolumePath;
  }

  envObj.DATABASE_URL = asLinuxPath(
    `file:${path.join(envObj.TPR_CHANNEL_VOLUME_PATH, 'db/app.db')}`,
  );
  console.log('envObj');
  console.log(envObj);

  validateFinalEnvObj(envObj);
}

export default prepareVolumeAndEnv;
