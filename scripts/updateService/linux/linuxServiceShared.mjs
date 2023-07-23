import path from 'node:path';

const serviceFilename = 'tpr-gen-updater.service';

export const serviceDir = '/lib/systemd/system';
export const serviceFilePath = path.join(serviceDir, serviceFilename);
export const serviceNameNoExt = path.parse(serviceFilename).name;

export function checkThrowSpawnSyncResult(result) {
  const error = result.stderr ? result.stderr.toString() : null;
  if (error) {
    throw new Error(error);
  } else if (result.status !== 0) {
    throw new Error(`result.status was non-zero ${result.status}.`);
  }
}
