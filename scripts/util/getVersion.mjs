import path from 'node:path';
import fs from 'fs-extra';
import getRootDir from './getRootDir.mjs';

const rootDir = getRootDir();
const {version} = JSON.parse(fs.readFileSync(path.join(rootDir, 'standalone/package.json')));

export function getVersion() {
  return version;
}
