/**
 * @module preload
 */

console.log('in preloadddda');
import {ipcRenderer} from 'electron';
import {IpcChannel} from '../../shared/ipcChannels';

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

export function cancelAutoInstall() {
  ipcRenderer.send(IpcChannel.cancelAutoinstall);
}

export {sha256sum} from './nodeCrypto';
export {versions} from './versions';
