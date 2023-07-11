import fs from 'fs-extra';
import path from 'node:path';
import * as semver from 'semver';
import getRootDir from './getRootDir.mjs';

const rootDir = getRootDir();

function getChannelString() {
  const packageJsonPath = path.join(rootDir, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath));
  const appVersion = packageJson.version;

  if (semver.parse(appVersion) == null) {
    throw new Error(`Critical error: semver failed to parse app version "${appVersion}".`);
  }
  const prereleaseVal = semver.prerelease(appVersion);
  if (prereleaseVal == null) {
    return 'stable';
  }
  const channel = prereleaseVal[0];
  if (!channel) {
    throw new Error(`Failed to parse channel from appVersion "${appVersion}".`);
  }
  return channel;
}

export default getChannelString;
