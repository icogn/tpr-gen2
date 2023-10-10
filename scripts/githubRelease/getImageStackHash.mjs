import fs from 'fs-extra';
import path from 'node:path';
import crypto from 'node:crypto';
import yaml from 'yaml';
import getRootDir from '../util/getRootDir.mjs';
import { prepareDeployEnv } from '../util/prepareEnv.mjs';

const rootDir = getRootDir();
const stackFilePath = path.join(rootDir, 'compose.yml');

const envKeysWhichCanBeIgnored = ['TPR_GIT_COMMIT', 'TPR_IMAGE_VERSION', 'HOST_PORT'];

// Note: any env variables in the secrets and configs are expected to map to
// 'undefined' since the secrets and configs are not part of `prepareDeployEnv`.
// This is fine since we don't care about the exact value. Shouldn't matter
// either way since changing the compose file will result in a different hash,
// so we don't need to manually add these keys to the ignore list.
function strImportantEnvValues(ymlContent) {
  const deployEnv = prepareDeployEnv();

  const reg = /\${([^}]+)}/g;

  let matches;
  const output = [];
  while ((matches = reg.exec(ymlContent))) {
    const match = matches[1];
    const colonIndex = match.indexOf(':');
    if (colonIndex >= 0) {
      output.push(match.substring(0, colonIndex));
    } else {
      output.push(match);
    }
  }

  const keysToIgnore = envKeysWhichCanBeIgnored.reduce((acc, key) => {
    acc[key] = true;
    return acc;
  }, {});

  const filtered = output.filter(envKey => !keysToIgnore[envKey]);
  const mapped = filtered.map(envKey => {
    return `${envKey}=${deployEnv[envKey]}`;
  });
  return mapped.join('===');
}

// Normalizes the file content (differences in whitespace and comments should
// resolve to the same thing).
function getSimplifiedComposeContent() {
  const fileContents = fs.readFileSync(stackFilePath).toString();
  const parsed = yaml.parse(fileContents);
  let str = yaml.stringify(parsed);
  // This should make the line endings all be 0x0a regardless of the OS which is
  // doing the deploying.
  str = str.replace(/(?:\r\n|\r|\n)/g, '\n');
  return str;
}

// Provides a hash which is put onto the end of the image created on the github
// release. This can be used to check if the local repo instance can run the
// same deploy since there has been no change.
function getImageStackHash() {
  const composeContent = getSimplifiedComposeContent();

  let toHash = composeContent;
  toHash += strImportantEnvValues(composeContent);

  return crypto.createHash('md5').update(toHash).digest('hex').substring(0, 8);
}

export default getImageStackHash;
