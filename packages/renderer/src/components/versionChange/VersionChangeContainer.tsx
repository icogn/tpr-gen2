import {useEffect, useState} from 'react';
import VersionChangePage from './VersionChangePage';
import type {ChannelInfo} from '../../../../shared/types';
import isObjectChannelInfo from '../../../../shared/isObjectChannelInfo';
import {checkForUpdates, updaterEmitter} from '#preload';
import type {UpdateInfo} from 'electron-updater';

function VersionChangeContainer() {
  const [channelInfo, setChannelInfo] = useState<ChannelInfo | null>(null);

  useEffect(() => {
    const msgListener = (e: MessageEvent) => {
      const url = new URL(e.origin);
      if (url.hostname === 'localhost') {
        const {data} = e;
        if (data.type === 'changeToChannel' && data.channelInfo) {
          if (isObjectChannelInfo(data.channelInfo)) {
            setChannelInfo(data.channelInfo as ChannelInfo);
          }
        }
      }
    };

    window.addEventListener('message', msgListener);

    return () => {
      window.removeEventListener('message', msgListener);
    };
  }, []);

  useEffect(() => {
    const handleCheckingForUpdate = () => {
      console.log('verCh received checkingForUpdate');
    };

    const handleUpdateAvailable = (info: UpdateInfo) => {
      console.log('verCh received updateAvailable');
      console.log(info);
    };

    updaterEmitter.on('checking-for-update', handleCheckingForUpdate);
    updaterEmitter.on('update-available', handleUpdateAvailable);

    return () => {
      updaterEmitter.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    if (channelInfo) {
      checkForUpdates(channelInfo);
    }
  }, [channelInfo]);

  const handleDownloadClick = () => {
    console.log('on download click');
  };

  return (
    <>
      {channelInfo && (
        <VersionChangePage
          channelInfo={channelInfo}
          onCancel={() => {
            setChannelInfo(null);
          }}
          onDownloadClick={handleDownloadClick}
        />
      )}
    </>
  );
}

export default VersionChangeContainer;
