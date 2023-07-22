import fs from 'fs-extra';
import path from 'node:path';
import getEnsureTmpDir from '../getEnsureTmpDir.mjs';

function getEnsureCacheDir() {
  const tmpDir = getEnsureTmpDir();
  const cacheDir = path.join(tmpDir, '.cache');
  fs.ensureDirSync(cacheDir);
  return cacheDir;
}

export default getEnsureCacheDir;
