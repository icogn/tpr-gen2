/**
 * @module preload
 */

console.log('in preloadddda');
import {ipcRenderer} from 'electron';
import {IpcChannel} from '../../shared/ipcChannels';
import type {ChannelInfo} from '../../shared/types';
import type {UpdateInfo, UpdateDownloadedEvent} from 'electron-updater';
import EventEmitter from 'events';
import type TypedEventEmitter from 'typed-emitter';
import type {ProgressInfo} from 'builder-util-runtime';

type AppUpdaterEvents = {
  error: (error: Error, message?: string) => void;
  // login: (info: AuthInfo, callback: LoginCallback) => void;
  'checking-for-update': () => void;
  'update-not-available': (info: UpdateInfo) => void;
  'update-available': (info: UpdateInfo) => void;
  'update-downloaded': (event: UpdateDownloadedEvent) => void;
  'download-progress': (info: ProgressInfo) => void;
  'update-cancelled': (info: UpdateInfo) => void;
  'appimage-filename-updated': (path: string) => void;
};

const updaterEmitterInner = new EventEmitter() as TypedEventEmitter<AppUpdaterEvents>;

export const updaterEmitter = {
  on<E extends keyof AppUpdaterEvents>(event: E, listener: AppUpdaterEvents[E]) {
    updaterEmitterInner.on(event, listener);
  },
  // `off` does not work since there is some context bridge isolation proxying
  // stuff at work:
  // https://www.electronjs.org/docs/latest/api/context-bridge/#parameter--error--return-type-support
  // The function which gets set in `on` will not match with what is passed in
  // `off` even if it seems like it should.
  removeAllListeners() {
    updaterEmitterInner.removeAllListeners();
  },
};

export function askDbReady(): Promise<boolean> {
  return new Promise(resolve => {
    ipcRenderer.once(IpcChannel.databaseReady, (event, success: boolean) => {
      resolve(success);
    });

    console.log('ASKING IF DB IS READY');
    ipcRenderer.send(IpcChannel.askDatabaseReady);
  });
}

export function askWebsiteReady(): Promise<boolean> {
  return new Promise(resolve => {
    ipcRenderer.once(IpcChannel.websiteReady, (event, success: boolean) => {
      resolve(success);
    });

    console.log('ASKING IF WEBSITE IS READY');
    ipcRenderer.send(IpcChannel.askWebsiteReady);
  });
}

export function askStartupUpdateReady(): Promise<string> {
  return new Promise(resolve => {
    ipcRenderer.once(IpcChannel.startupUpdateReady, (event, version: string) => {
      resolve(version);
    });

    console.log('ASKING IF STARTUPUPDATE READY');
    ipcRenderer.send(IpcChannel.askStartupUpdateReady);
  });
}

export function cancelAutoInstall() {
  ipcRenderer.send(IpcChannel.cancelAutoinstall);
}

export function triggerStartupUpdate() {
  ipcRenderer.send(IpcChannel.triggerStartupUpdate);
}

ipcRenderer.on(IpcChannel.checkingForUpdate, () => {
  console.log('renderer received checkingForUpdate');
  updaterEmitterInner.emit('checking-for-update');
});

ipcRenderer.on(IpcChannel.updateNotAvailable, (event, info: UpdateInfo) => {
  console.log('renderer received updateNotAvailable');
  console.log(info);
  updaterEmitterInner.emit('update-not-available', info);
});

ipcRenderer.on(IpcChannel.updateAvailable, (event, info: UpdateInfo) => {
  console.log('renderer received updateAvailable');
  console.log(info);
  updaterEmitterInner.emit('update-available', info);
});

ipcRenderer.on(
  IpcChannel.updateDownloaded,
  (event, updateDownloadedEvent: UpdateDownloadedEvent) => {
    console.log('renderer received updateDownloaded');
    console.log(updateDownloadedEvent);
    updaterEmitterInner.emit('update-downloaded', updateDownloadedEvent);
  },
);

ipcRenderer.on(IpcChannel.downloadProgress, (event, info: ProgressInfo) => {
  console.log('renderer received downloadProgress');
  console.log(info);
  updaterEmitterInner.emit('download-progress', info);
});

ipcRenderer.on(IpcChannel.updateCancelled, (event, info: UpdateInfo) => {
  console.log('renderer received updateCancelled');
  console.log(info);
  updaterEmitterInner.emit('update-cancelled', info);
});

ipcRenderer.on(IpcChannel.updaterError, (event, error: Error, message?: string) => {
  console.log('renderer received updaterError');
  console.log(error);
  console.log(message);
  updaterEmitterInner.emit('error', error, message);
});

export function checkForUpdates(channelInfo: ChannelInfo) {
  ipcRenderer.send(IpcChannel.checkForUpdates, channelInfo);
}

export function downloadUpdate() {
  ipcRenderer.send(IpcChannel.downloadUpdate);
}

export function cancelUpdate() {
  ipcRenderer.send(IpcChannel.cancelUpdater);
}

export {sha256sum} from './nodeCrypto';
export {versions} from './versions';
