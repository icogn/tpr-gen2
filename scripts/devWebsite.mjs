import path from 'node:path';
import {spawnSync} from 'node:child_process';
import getRootDir from './util/getRootDir.mjs';
import getYarnCommand from './util/getYarnCommand.mjs';
import {getVersion} from './util/getVersion.mjs';
import {prepareWebsiteEnv} from './prepareEnv.mjs';

const rootDir = getRootDir();

function main() {
  console.log('aaabbb');

  const env = {
    ...process.env,
    ...prepareWebsiteEnv({
      imageVersion: getVersion(),
    }),
  };

  const result = spawnSync(getYarnCommand(), ['dev'], {
    cwd: path.join(rootDir, 'website'),
    stdio: 'inherit',
    env,
  });
  console.log(result);
}

main();
