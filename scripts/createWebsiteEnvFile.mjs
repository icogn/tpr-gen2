import path from 'node:path';
import fs from 'fs-extra';
import getRootDir from './util/getRootDir.mjs';
import {createEnvFileContents, prepareWebsiteEnv} from './prepareEnv.mjs';
import {getVersion} from './util/getVersion.mjs';

// Note: it is okay to not pass in the version since the image should only ever
// be built when the current version is correct. If we fetch an image to deploy,
// the env is already baked into that image.
function createWebsiteEnvFile() {
  const rootDir = getRootDir();
  const tmpDir = path.join(rootDir, 'tmp');
  fs.ensureDirSync(tmpDir);

  const envFilePath = path.join(tmpDir, 'website.env');

  const contents = createEnvFileContents(prepareWebsiteEnv({imageVersion: getVersion()}));
  fs.writeFileSync(envFilePath, contents);
}

export default createWebsiteEnvFile;
