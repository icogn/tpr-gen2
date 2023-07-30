import {createCustomAppUpdater} from './CustomAppUpdater';
import type {WebContents} from 'electron';
import {ipcMain} from 'electron';
import {IpcChannel} from '../../../shared/ipcChannels';
import isObjectChannelInfo from '../../../shared/isObjectChannelInfo';
import type {ChannelInfo} from '../../../shared/types';
import type {UpdateInfo, AppUpdater, ProgressInfo, UpdateDownloadedEvent} from 'electron-updater';
import basicEventEmitter from '../util/basicEventEmitter';

// Ideally we would allow the user to cancel the update once it starts doing it.
// Starting an update download and canceling it twice in a row causes all of the
// electron-updater requests to hang either indefinitely or a really long time.
// So we for now we will not allow the user to cancel the download. Issues which
// seem related:
// https://github.com/electron-userland/electron-builder/issues/7056
// https://github.com/electron-userland/electron-builder/issues/5795

let customAppUpdater: AppUpdater | null = null;
let isStartupCheck = false;
let desiredVersion = '';
let webContents: WebContents | null = null;
let removeListeners: (() => void) | null;

export const startupUpdateReadyEmitter = basicEventEmitter<string>();

export function handleCheckForUpdatesRequest(
  maybeChannelInfo: unknown,
  event: Electron.IpcMainEvent | null,
  specificVersion?: string,
) {
  console.log('in checkForUpdates');
  if (!isObjectChannelInfo(maybeChannelInfo)) {
    return;
  }
  const channelInfo = maybeChannelInfo as ChannelInfo;

  if (event) {
    // not startup check
    webContents = event.sender;
    isStartupCheck = false;
    desiredVersion = '';
    checkForUpdateOnChannel(channelInfo);
  } else {
    // startup check
    webContents = null;
    isStartupCheck = true;
    desiredVersion = specificVersion || '';
    checkForUpdateOnChannel(channelInfo);
  }
}

function startDownload() {
  if (customAppUpdater) {
    customAppUpdater.downloadUpdate();
  } else {
    console.error('Attempted to download update when customAppUpdater was null.');
  }
}

export function triggerStartupUpdateInstall() {
  if (!isStartupCheck) {
    console.error('Attempted to install startup update when isStartupCheck was false');
  } else if (!customAppUpdater) {
    console.error('Attempted to install startup update when customAppUpdater was null.');
  } else {
    customAppUpdater.quitAndInstall(false);
  }
}

export function setupUpdater() {
  ipcMain.on(IpcChannel.checkForUpdates, (event, maybeChannelInfo: unknown) => {
    handleCheckForUpdatesRequest(maybeChannelInfo, event);
  });

  // Note: differential downloads are expected to always fail when swapping
  // branches due to a hash mismatch. There is no way to manually disable
  // differential downloads currently, so for now we will see the progress bar
  // twice.
  ipcMain.on(IpcChannel.downloadUpdate, () => {
    startupUpdateReadyEmitter.update('');
    startDownload();
  });

  ipcMain.on(IpcChannel.cancelUpdater, () => {
    cancelUpdater();
  });
}

async function checkForUpdateOnChannel(channelInfo: ChannelInfo) {
  cancelUpdater();

  customAppUpdater = createCustomAppUpdater(channelInfo);

  const onCheckingForUpdate = () => {
    console.log('WWWWW updater -- checking-for-update');
    if (!isStartupCheck && webContents && !webContents.isDestroyed()) {
      webContents.send(IpcChannel.checkingForUpdate);
    }
  };

  const onUpdateNotAvailable = (info: UpdateInfo) => {
    console.log('WWWWW updater -- update-not-available:');
    console.log(info);
    if (isStartupCheck) {
      startupUpdateReadyEmitter.update('');
    } else if (webContents && !webContents.isDestroyed()) {
      webContents.send(IpcChannel.updateNotAvailable, info);
    }
  };

  const onUpdateAvailable = (info: UpdateInfo) => {
    console.log('WWWWW updater -- update-available:');
    console.log(info);
    if (isStartupCheck) {
      if (!desiredVersion || desiredVersion === info.version) {
        startDownload();
      } else {
        startupUpdateReadyEmitter.update('');
      }
    } else if (webContents && !webContents.isDestroyed()) {
      webContents.send(IpcChannel.updateAvailable, info);
    }
  };

  const onUpdateDownloaded = (event: UpdateDownloadedEvent) => {
    console.log('WWWWW updater -- update-downloaded:');
    console.log(event);
    if (isStartupCheck) {
      startupUpdateReadyEmitter.update(event.version);

      // Show popup on the UI
      // Send event to UI.
      //
      // Notification needs to happen at the renderer level. This makes sense
      // since it is 100% related to standalone only, and also we don't want to
      // lose it on page change.
    } else if (webContents && !webContents.isDestroyed()) {
      webContents.send(IpcChannel.updateDownloaded, event);
      customAppUpdater?.quitAndInstall(false);
    }
  };

  const onDownloadProgress = (info: ProgressInfo) => {
    console.log('WWWWW updater -- download-progress:');
    console.log(info);
    if (!isStartupCheck && webContents && !webContents.isDestroyed()) {
      webContents.send(IpcChannel.downloadProgress, info);
    }
  };

  const onError = (error: Error, message?: string) => {
    console.log('WWWWW updater -- appUpdater error:');
    console.log(error);
    console.log(message);
    if (isStartupCheck) {
      startupUpdateReadyEmitter.update('');
    } else if (webContents && !webContents.isDestroyed()) {
      webContents.send(IpcChannel.updaterError, error, message);
    }
  };

  customAppUpdater.on('checking-for-update', onCheckingForUpdate);
  customAppUpdater.on('update-not-available', onUpdateNotAvailable);
  customAppUpdater.on('update-available', onUpdateAvailable);
  customAppUpdater.on('update-downloaded', onUpdateDownloaded);
  customAppUpdater.on('download-progress', onDownloadProgress);
  customAppUpdater.on('error', onError);

  removeListeners = () => {
    customAppUpdater?.removeAllListeners();
  };

  customAppUpdater.checkForUpdates();
}

function cancelUpdater() {
  if (removeListeners) {
    removeListeners();
    removeListeners = null;
  }
  if (customAppUpdater) {
    customAppUpdater = null;
  }
}
