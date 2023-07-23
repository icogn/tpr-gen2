import fs from 'fs-extra';
import {spawnSync} from 'node:child_process';
import {
  checkThrowSpawnSyncResult,
  serviceFilePath,
  serviceNameNoExt,
} from './linuxServiceShared.mjs';

// Note: you may need to add sudo when you run this. If it still fails, you can
// always do the steps in this file manually.

function main() {
  if (!fs.existsSync(serviceFilePath)) {
    console.error(
      `Failed to file service file at "${serviceFilePath}".\nService likely already uninstalled.`,
    );
    process.exit(1);
  }

  // Stop service
  const resultStop = spawnSync('systemctl', ['stop', serviceNameNoExt], {stdio: 'inherit'});
  checkThrowSpawnSyncResult(resultStop);

  // Delete file
  fs.rmSync(serviceFilePath);

  // Notify of changes
  const resultReload = spawnSync('systemctl', ['daemon-reload'], {stdio: 'inherit'});
  checkThrowSpawnSyncResult(resultReload);

  console.log(`Service "${serviceNameNoExt}" uninstalled.`);
}

main();
