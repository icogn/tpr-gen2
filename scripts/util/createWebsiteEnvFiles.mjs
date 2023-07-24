import path from 'node:path';
import fs from 'fs-extra';
import getRootDir from './getRootDir.mjs';
import {createEnvFileContents, prepareWebsiteEnv} from './prepareEnv.mjs';
import {getVersion} from './getVersion.mjs';

// Note: it is okay to not pass in the version since the image should only ever
// be built when the current version is correct. If we fetch an image to deploy,
// the env is already baked into that image.
function createWebsiteEnvFiles() {
  const rootDir = getRootDir();
  const tmpDir = path.join(rootDir, 'tmp');
  fs.ensureDirSync(tmpDir);

  const envFilePath = path.join(tmpDir, 'website.env');

  const envObj = prepareWebsiteEnv({imageVersion: getVersion()});

  // Write as env file
  const envFileContents = createEnvFileContents(envObj);
  fs.writeFileSync(envFilePath, envFileContents);

  // Write as json file
  const envJsonPath = path.join(tmpDir, 'website.env.json');
  fs.writeJSONSync(envJsonPath, envObj);
}

export default createWebsiteEnvFiles;
