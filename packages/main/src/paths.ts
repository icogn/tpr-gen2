import path from 'node:path';
import {app} from 'electron';
import semver from 'semver';

const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.IS_TEST === 'true';

function computeChannelString() {
  const appVersion = app.getVersion();
  if (semver.parse(appVersion) == null) {
    throw new Error(`Critical error: semver failed to parse app version "${appVersion}".`);
  }
  const prereleaseVal = semver.prerelease(appVersion);
  if (prereleaseVal == null) {
    return 'stable';
  }
  const channel = String(prereleaseVal[0]);
  if (!channel) {
    throw new Error(`Failed to parse channel from appVersion "${appVersion}".`);
  }
  return channel;
}

// TODO: these will need to be updated to handle the Docker image version.

export const nodeModulesDir =
  isProduction && !isTest
    ? path.resolve(path.join(app.getAppPath(), '../node_modules'))
    : path.resolve('./node_modules');

let rootVolumeDirectory;
if (isTest) {
  rootVolumeDirectory = path.resolve('./volume-test');
} else if (isProduction) {
  rootVolumeDirectory = path.resolve(path.join(app.getPath('userData'), 'volume'));
} else {
  rootVolumeDirectory = path.resolve('./volume');
}

const channel = computeChannelString();

export const rootVolumePath = rootVolumeDirectory;
export const channelVolumePath = path.join(rootVolumeDirectory, channel);
console.log(`rootVolumePath:${rootVolumePath}`);
console.log(`channelVolumePath:${channelVolumePath}`);

export const prismaSchemaPath =
  isProduction && !isTest
    ? path.join(app.getAppPath(), '../prisma/schema.prisma')
    : path.resolve('./website/prisma/schema.prisma');

const appPathDirName = path.dirname(app.getAppPath());

export const serverJsDir =
  isProduction && !isTest
    ? path.join(appPathDirName, 'standalone-website/website')
    : path.resolve('./website/.next/standalone/website');

console.log(`serverJsDir:${serverJsDir}`);
