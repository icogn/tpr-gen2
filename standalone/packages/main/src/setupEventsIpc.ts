import {app, ipcMain} from 'electron';
import semver from 'semver';
// import {ipcMain} from 'electron';
import {websiteReadyEmitter} from './website/forkWebsiteProcess';
// import {dbPreparedEmitter} from './prisma/prepareDb';
// // import {autoUpdater} from 'electron-updater';
import {IpcChannel} from '../../shared/ipcChannels';

function computeChannelKey() {
  // return 'exampleChanKey';
  const appVersion = app.getVersion();
  if (semver.parse(appVersion) == null) {
    throw new Error(`Critical error: semver failed to parse app version "${appVersion}".`);
  }
  const prereleaseVal = semver.prerelease(appVersion);
  if (prereleaseVal == null) {
    return 'stable';
  }
  const channel = String(prereleaseVal[0]);
  if (!channel) {
    throw new Error(`Failed to parse channel from appVersion "${appVersion}".`);
  }
  return channel;
}

function setupEventsIpc() {
  ipcMain.on(IpcChannel.askDatabaseReady, () => {
    // ipcMain.on('tpr:ask-database-ready', event => {
    console.log('abc');
    const key = computeChannelKey();
    console.log(key);
    // dbPreparedEmitter.onceOrPrev((success: boolean | undefined) => {
    //   console.log(success);
    //   // if (success != null && !event.sender.isDestroyed()) {
    //   //   event.sender.send(IpcChannel.databaseReady, success);
    //   // }
    // });
  });

  ipcMain.on(IpcChannel.askWebsiteReady, event => {
    websiteReadyEmitter.onceOrPrev((success: boolean | undefined) => {
      if (success != null && !event.sender.isDestroyed()) {
        event.sender.send(IpcChannel.websiteReady, success);
      }
    });
  });

  // ipcMain.on(IpcChannel.cancelAutoinstall, () => {
  //   console.log('Setting autoUpdater.autoInstallOnAppQuit to false');
  //   autoUpdater.autoInstallOnAppQuit = false;
  // });
}

export default setupEventsIpc;
