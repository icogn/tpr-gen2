import fs from 'fs-extra';
import {spawnSync} from 'node:child_process';
import {
  checkThrowSpawnSyncResult,
  serviceFilePath,
  serviceNameNoExt,
} from './linuxServiceShared.mjs';

function main() {
  if (!fs.existsSync(serviceFilePath)) {
    throw new Error(
      `Expected to file service file at "${serviceFilePath}", but found nothing. Service likely already uninstalled.`,
    );
  }

  // Stop service
  const resultStop = spawnSync('systemctl', ['stop', serviceNameNoExt], {stdio: 'inherit'});
  checkThrowSpawnSyncResult(resultStop);

  // Delete file
  fs.rmSync(serviceFilePath);

  // Notify of changes
  const resultReload = spawnSync('systemctl', ['daemon-reload'], {stdio: 'inherit'});
  checkThrowSpawnSyncResult(resultReload);
}

main();
