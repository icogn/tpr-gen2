// Workflow:
// - open fullscreen on page
// - check for latest version
// - version not found => done
// - version found
// - cancel, closes popup, updater cleans up in main
// - or start download
// - ui changes to show download percentage
// - ui gets update downloaded event
//   - probably doesn't matter since will immediately restart
// - call quitAndInstall or something with silent set to false

import {CancellationToken} from 'electron-updater';
import {createCustomAppUpdater} from './CustomAppUpdater';
import type {WebContents} from 'electron';
import {ipcMain} from 'electron';
import {IpcChannel} from '../../../shared/ipcChannels';
import isObjectChannelInfo from '../../../shared/isObjectChannelInfo';
import type {ChannelInfo} from '../../../shared/types';
import type {UpdateInfo, AppUpdater, ProgressInfo, UpdateDownloadedEvent} from 'electron-updater';

// UI states:
// - initial, loading the version info, can only click cancel
// - info found, can click to start download or cancel
// - downloading, can click cancel
// - restarting, after update completed

// emit events to the window:

// download-progress
// update-downloaded
// download failed

// provide way to cancel the download

// Creating a new instance should clean up the old instance: cancel,
// autoInstallOnQuit to false, dereference

// interface:
// checkForUpdateOnChannel
// downloadAndInstall
// cancel - can cancel at any point

// Ideally we would allow the user to cancel the update once it starts doing it.
// Starting an update download and canceling it twice in a row causes all of the
// electron-updater requests to hang either indefinitely or a really long time.
// So we for now we will not allow the user to cancel the download. Issues which
// seem related:
// https://github.com/electron-userland/electron-builder/issues/7056
// https://github.com/electron-userland/electron-builder/issues/5795

let customAppUpdater: AppUpdater | null = null;
let cancellationToken: CancellationToken | null = null;
let webContents: WebContents | null = null;
let removeListeners: (() => void) | null;

// forward events to renderer

export function setupUpdater() {
  ipcMain.on(IpcChannel.checkForUpdates, (event, maybeChannelInfo: unknown) => {
    console.log('in checkForUpdates');
    if (!isObjectChannelInfo(maybeChannelInfo)) {
      return;
    }
    const channelInfo = maybeChannelInfo as ChannelInfo;

    webContents = event.sender;

    checkForUpdateOnChannel(channelInfo);
  });

  ipcMain.on(IpcChannel.downloadUpdate, () => {
    if (customAppUpdater) {
      cancellationToken = new CancellationToken();
      customAppUpdater.downloadUpdate(cancellationToken).catch(() => {
        // Unexpected errors should get emitted as 'error'. We still need to
        // catch here for when we manually cancel.
      });
    } else {
      console.error('Attempted to download update when customAppUpdater was null.');
    }
  });

  ipcMain.on(IpcChannel.cancelUpdate, () => {
    cancelUpdate();
  });
}

async function checkForUpdateOnChannel(channelInfo: ChannelInfo) {
  cancelUpdate();

  customAppUpdater = createCustomAppUpdater(channelInfo);

  const onCheckingForUpdate = () => {
    console.log('WWWWW updater -- checking-for-update');
    if (webContents && !webContents.isDestroyed()) {
      webContents.send(IpcChannel.checkingForUpdate);
    }
  };

  const onUpdateNotAvailable = (info: UpdateInfo) => {
    console.log('WWWWW updater -- update-not-available:');
    console.log(info);
    if (webContents && !webContents.isDestroyed()) {
      webContents.send(IpcChannel.updateNotAvailable, info);
    }
  };

  const onUpdateAvailable = (info: UpdateInfo) => {
    console.log('WWWWW updater -- update-available:');
    console.log(info);
    if (webContents && !webContents.isDestroyed()) {
      webContents.send(IpcChannel.updateAvailable, info);
    }
  };

  const onUpdateDownloaded = (event: UpdateDownloadedEvent) => {
    console.log('WWWWW updater -- update-downloaded:');
    console.log(event);
    if (webContents && !webContents.isDestroyed()) {
      webContents.send(IpcChannel.updateDownloaded, event);
    }

    customAppUpdater?.quitAndInstall(false);
  };

  const onDownloadProgress = (info: ProgressInfo) => {
    console.log('WWWWW updater -- download-progress:');
    console.log(info);
    if (webContents && !webContents.isDestroyed()) {
      webContents.send(IpcChannel.downloadProgress, info);
    }
  };

  const onError = (error: Error, message?: string) => {
    console.log('WWWWW updater -- appUpdater error:');
    console.log(error);
    console.log(message);
    if (webContents && !webContents.isDestroyed()) {
      webContents.send(IpcChannel.updaterError, error, message);
    }
  };

  customAppUpdater.on('checking-for-update', onCheckingForUpdate);
  customAppUpdater.on('update-not-available', onUpdateNotAvailable);
  customAppUpdater.on('update-available', onUpdateAvailable);
  customAppUpdater.on('update-downloaded', onUpdateDownloaded);
  customAppUpdater.on('download-progress', onDownloadProgress);
  // Note: we don't get the update-cancelled event since we stop listening as soon as
  // we call cancel.
  customAppUpdater.on('error', onError);

  removeListeners = () => {
    if (customAppUpdater) {
      customAppUpdater.off('checking-for-update', onCheckingForUpdate);
      customAppUpdater.off('update-not-available', onUpdateNotAvailable);
      customAppUpdater.off('update-available', onUpdateAvailable);
      customAppUpdater.off('update-downloaded', onUpdateDownloaded);
      customAppUpdater.off('download-progress', onDownloadProgress);
      customAppUpdater.off('error', onError);
    }
  };

  customAppUpdater.checkForUpdates();
}

function cancelUpdate() {
  if (removeListeners) {
    removeListeners();
    removeListeners = null;
  }
  if (cancellationToken) {
    cancellationToken.cancel();
    cancellationToken.dispose();
    cancellationToken = null;
  }
  if (customAppUpdater) {
    customAppUpdater = null;
  }
}
