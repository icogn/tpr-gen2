import fs from 'node:fs';
import path from 'node:path';
import semver from 'semver';

function asLinuxPath(inputPath) {
  return inputPath.replace(/\\/g, '/');
}

function validateInitialEnvObj(envObj) {
  if (!envObj || typeof envObj !== 'object') {
    throw new Error('envObj is not an object!');
  }

  if (!envObj.TPR_ROOT_VOLUME_PATH) {
    throw new Error('TPR_ROOT_VOLUME_PATH is missing!');
  }
}

function validateFinalEnvObj(finalEnvObj) {
  if (!finalEnvObj || typeof finalEnvObj !== 'object') {
    throw new Error('envObj is not an object!');
  }

  if (!finalEnvObj.TPR_CHANNEL_VOLUME_PATH) {
    throw new Error('TPR_CHANNEL_VOLUME_PATH is missing!');
  }
}

function getChannelKeyFromVersion(version) {
  if (semver.parse(version) == null) {
    throw new Error(`semver failed to parse "${version}".`);
  }

  const prerelease = semver.prerelease(version);
  if (prerelease == null) {
    return 'stable';
  } else if (prerelease.length > 0) {
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

    return prerelease[0];
  } else {
    throw new Error(`semver parsed prerelease but has 0 length. Version was "${version}".`);
  }
}

function applyEnvValues(envObj, config, channelKey) {
  const validKeys = {
    NEXTAUTH_URL: true,
  };

  if (config.byChannelKey && config.byChannelKey[channelKey]) {
    const {env} = config.byChannelKey[channelKey];
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
function prepareVolumeAndEnv(envObj) {
  console.log('in prepareVolumeAndEnv');
  validateInitialEnvObj(envObj);

  const channelKey = getChannelKeyFromVersion(envObj.TPR_IMAGE_VERSION);
  console.log('channelKey:');
  console.log(channelKey);

  const config = JSON.parse(fs.readFileSync('/deploy_config').toString());
  console.log('config:');
  console.log(config);
  applyEnvValues(envObj, config, channelKey);

  let testingMigration = false;

  if (config.testMigration && config.testMigration.enabled) {
    console.log('testMigration is enabled.');
  }

  if (!testingMigration) {
    const channelVolumePath = path.join(envObj.TPR_ROOT_VOLUME_PATH, 'chn', channelKey);
    if (!fs.existsSync(channelVolumePath)) {
      fs.mkdirSync(channelVolumePath, {recursive: true});
    }
    envObj.TPR_CHANNEL_VOLUME_PATH = channelVolumePath;
  }

  envObj.DATABASE_URL = asLinuxPath(
    'file:' + path.join(envObj.TPR_CHANNEL_VOLUME_PATH, 'db/app.db'),
  );
  console.log('envObj');
  console.log(envObj);

  validateFinalEnvObj(envObj);
}

export default prepareVolumeAndEnv;
