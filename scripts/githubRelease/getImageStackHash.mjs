import fs from 'fs-extra';
import path from 'node:path';
import crypto from 'node:crypto';
import getRootDir from '../util/getRootDir.mjs';
import {prepareDeployEnv} from '../prepareEnv.mjs';

const rootDir = getRootDir();
const stackFilePath = path.join(rootDir, 'compose.yml');

const envKeysWhichCanBeIgnored = ['TPR_GIT_COMMIT', 'IMAGE_VERSION', 'HOST_PORT'];

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

  return output
    .filter(envKey => envKeysWhichCanBeIgnored.indexOf(envKey) < 0)
    .map(envKey => deployEnv[envKey])
    .join('###');
}

// Provides a hash which is put onto the end of the image created on the github
// release. This can be used to check if the local repo instance can run the
// same deploy since there has been no change.
function getImageStackHash() {
  let content = fs.readFileSync(stackFilePath).toString();

  content += strImportantEnvValues(content);

  envKeysWhichCanBeIgnored.forEach(key => {
    content += '#&#&';
    content += key;
  });

  return crypto.createHash('md5').update(content).digest('hex').substring(0, 8);
}

export default getImageStackHash;
