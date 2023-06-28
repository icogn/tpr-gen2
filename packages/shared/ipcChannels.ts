export enum IpcChannel {
  askDatabaseReady = 'tpr:ask-database-ready',
  databaseReady = 'tpr:database-ready',
  askWebsiteReady = 'tpr:ask-website-ready',
  websiteReady = 'tpr:website-ready',
  cancelAutoinstall = 'tpr:cancel-autoinstall',

  checkForUpdates = 'tpr:checkForUpdates',
  checkingForUpdate = 'tpr:checking-for-update',
  updateAvailable = 'tpr:update-available',
}
