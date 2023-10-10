import { ipcMain } from 'electron';
import { websiteReadyEmitter } from './website/forkWebsiteProcess';
import { dbPreparedEmitter } from './prisma/prepareDb';
import { autoUpdater } from 'electron-updater';
import { IpcChannel } from '../../shared/ipcChannels';
import { startupUpdateReadyEmitter, triggerStartupUpdateInstall } from './updater/updaterInstance';

function setupEventsIpc() {
  ipcMain.on(IpcChannel.askDatabaseReady, event => {
    dbPreparedEmitter.onceOrPrev((success: boolean | undefined) => {
      if (success != null && !event.sender.isDestroyed()) {
        event.sender.send(IpcChannel.databaseReady, success);
      }
    });
  });

  ipcMain.on(IpcChannel.askWebsiteReady, event => {
    websiteReadyEmitter.onceOrPrev((success: boolean | undefined) => {
      if (success != null && !event.sender.isDestroyed()) {
        event.sender.send(IpcChannel.websiteReady, success);
      }
    });
  });

  ipcMain.on(IpcChannel.askStartupUpdateReady, event => {
    startupUpdateReadyEmitter.onceOrPrev((version: string | undefined) => {
      if (version != null && !event.sender.isDestroyed()) {
        event.sender.send(IpcChannel.startupUpdateReady, version);
      }
    });
  });

  ipcMain.on(IpcChannel.triggerStartupUpdate, () => {
    triggerStartupUpdateInstall();
  });

  ipcMain.on(IpcChannel.cancelAutoinstall, () => {
    console.log('Setting autoUpdater.autoInstallOnAppQuit to false');
    autoUpdater.autoInstallOnAppQuit = false;
  });
}

export default setupEventsIpc;
