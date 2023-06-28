import {useEffect, useState} from 'react';
import FullScreenPopup from '../FullScreenPopup';
import type {ChannelInfo} from '../../../../shared/types';
import {cancelUpdate, checkForUpdates, downloadUpdate, updaterEmitter} from '#preload';
import type {ProgressInfo, UpdateInfo} from 'electron-updater';
import styles from './VersionChangePopup.module.css';

type VersionChangePopupProps = {
  channelInfo: ChannelInfo;
  onCancel: () => void;
};

function VersionChangePage({channelInfo, onCancel}: VersionChangePopupProps) {
  const [updateVersion, setUpdateVersion] = useState('');
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<ProgressInfo | null>(null);
  const [updateDownloaded, setUpdateDownloaded] = useState(false);

  useEffect(() => {
    const handleCheckingForUpdate = () => {
      console.log('verCh received checkingForUpdate');
    };

    const handleUpdateAvailable = (info: UpdateInfo) => {
      console.log('verCh received updateAvailable');
      console.log(info);
      setUpdateVersion(info.version);
    };

    const handleDownloadProgress = (info: ProgressInfo) => {
      console.log('verCh received downloadProgress');
      console.log(info);
      setDownloadProgress(info);
    };

    const handleUpdateDownloaded = () => {
      // disable ui buttons
      setUpdateDownloaded(true);
    };

    updaterEmitter.on('checking-for-update', handleCheckingForUpdate);
    updaterEmitter.on('update-available', handleUpdateAvailable);
    updaterEmitter.on('download-progress', handleDownloadProgress);
    updaterEmitter.on('update-downloaded', handleUpdateDownloaded);

    return () => {
      updaterEmitter.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    if (channelInfo) {
      console.log('calling checkForUpdates');
      checkForUpdates(channelInfo);
    }
  }, [channelInfo]);

  const handleCancelClick = () => {
    cancelUpdate();
    onCancel();
  };

  const handleDownloadClick = () => {
    console.log('on download click');
    setDownloadStarted(true);
    downloadUpdate();
  };

  return (
    <FullScreenPopup>
      <div className={styles.title}>Swap generator branch</div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <tbody>
            <tr>
              <td>name:</td>
              <td>{channelInfo?.name} </td>
            </tr>
            <tr>
              <td>version:</td>
              <td>{updateVersion}</td>
            </tr>
          </tbody>
        </table>
      </div>
      {downloadStarted && (
        <>
          <div>DownloadProgress</div>
          <div>{downloadProgress?.percent || '0'}</div>
        </>
      )}
      <div className={styles.bodyText}>
        Once the download is complete, the generator will restart to install the new version. This
        may take several seconds.
      </div>
      <div className={styles.bodyText}>
        This is an non-stable branch. Backwards compatibility between versions is not maintained.
        This will not affect your data on the stable branch.
      </div>
      {!downloadStarted && (
        <div className={styles.buttonsWrapper}>
          <button
            onClick={handleCancelClick}
            disabled={updateDownloaded}
          >
            Cancel
          </button>
          <button
            onClick={handleDownloadClick}
            className={styles.buttonsRightBtn}
            disabled={!updateVersion}
          >
            Swap Branch
          </button>
        </div>
      )}
    </FullScreenPopup>
  );
}

export default VersionChangePage;
