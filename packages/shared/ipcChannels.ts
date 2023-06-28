export enum IpcChannel {
  askDatabaseReady = 'tpr:ask-database-ready',
  databaseReady = 'tpr:database-ready',
  askWebsiteReady = 'tpr:ask-website-ready',
  websiteReady = 'tpr:website-ready',
  cancelAutoinstall = 'tpr:cancel-autoinstall',

  checkForUpdates = 'tpr:checkForUpdates',
  downloadUpdate = 'tpr:downloadUpdate',
  cancelUpdate = 'tpr:cancelUpdate',

  checkingForUpdate = 'tpr:checking-for-update',
  updateNotAvailable = 'tpr:update-not-available',
  updateAvailable = 'tpr:update-available',
  updateDownloaded = 'tpr:update-downloaded',
  downloadProgress = 'tpr:download-progress',
  updateCancelled = 'tpr:update-cancelled',
  updaterError = 'tpr:updaterError',
}
