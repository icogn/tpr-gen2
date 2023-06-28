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

import type {
  AppUpdater,
  CancellationToken,
  ProgressInfo,
  UpdateDownloadedEvent,
} from 'electron-updater';
import {createCustomAppUpdater} from './CustomAppUpdater';
import type {WebContents} from 'electron';
import {ipcMain} from 'electron';
import {IpcChannel} from '../../../shared/ipcChannels';
import isObjectChannelInfo from '../../../shared/isObjectChannelInfo';
import type {ChannelInfo} from '../../../shared/types';
import type {UpdateInfo} from 'electron-updater';

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

let customAppUpdater: AppUpdater | null = null;
let cancellationToken: CancellationToken | null = null;
let webContents: WebContents | null = null;
let removeListeners: (() => void) | null;

// forward events to renderer

ipcMain.on(IpcChannel.checkForUpdates, (event, maybeChannelInfo: unknown) => {
  if (!isObjectChannelInfo(maybeChannelInfo)) {
    return;
  }
  const channelInfo = maybeChannelInfo as ChannelInfo;

  webContents = event.sender;

  checkForUpdateOnChannel(channelInfo);

  // dbPreparedEmitter.onceOrPrev((success: boolean | undefined) => {
  //   if (success != null && !event.sender.isDestroyed()) {
  //     event.sender.send(IpcChannel.check, success);
  //   }
  // });
});

export async function checkForUpdateOnChannel(channelInfo: ChannelInfo) {
  cancel();

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
  };

  const onDownloadProgress = (info: ProgressInfo) => {
    console.log('WWWWW updater -- download-progress:');
    console.log(info);
  };

  const onUpdateCancelled = (info: UpdateInfo) => {
    console.log('WWWWW updater -- update-cancelled:');
    console.log(info);
  };

  const onError = (error: Error, message?: string) => {
    console.log('WWWWW updater -- appUpdater error:');
    console.log(error);
    console.log(message);
  };

  customAppUpdater.on('checking-for-update', onCheckingForUpdate);
  customAppUpdater.on('update-not-available', onUpdateNotAvailable);
  customAppUpdater.on('update-available', onUpdateAvailable);
  customAppUpdater.on('update-downloaded', onUpdateDownloaded);
  customAppUpdater.on('download-progress', onDownloadProgress);
  customAppUpdater.on('update-cancelled', onUpdateCancelled);
  customAppUpdater.on('error', onError);

  removeListeners = () => {
    if (customAppUpdater) {
      customAppUpdater.off('checking-for-update', onCheckingForUpdate);
      customAppUpdater.off('update-not-available', onUpdateNotAvailable);
      customAppUpdater.off('update-available', onUpdateAvailable);
      customAppUpdater.off('update-downloaded', onUpdateDownloaded);
      customAppUpdater.off('download-progress', onDownloadProgress);
      customAppUpdater.off('update-cancelled', onUpdateCancelled);
      customAppUpdater.off('error', onError);
    }
  };

  customAppUpdater.checkForUpdates();
}

function cancel() {
  if (removeListeners) {
    removeListeners();
    removeListeners = null;
  }
  if (cancellationToken) {
    cancellationToken.cancel();
    cancellationToken = null;
  }
  if (customAppUpdater) {
    customAppUpdater = null;
  }
}
