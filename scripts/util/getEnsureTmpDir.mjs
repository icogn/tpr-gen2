import fs from 'fs-extra';
import path from 'node:path';
import getRootDir from './getRootDir.mjs';

const rootDir = getRootDir();

function getEnsureTmpDir() {
  const tmpDir = path.join(rootDir, 'tmp');
  fs.ensureDirSync(tmpDir);
  return tmpDir;
}

export default getEnsureTmpDir;
