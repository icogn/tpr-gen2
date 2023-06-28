import {useEffect, useState} from 'react';
import VersionChangePage from './VersionChangePage';
import type {ChannelInfo} from '../../../../shared/types';
import isObjectChannelInfo from '../../../../shared/isObjectChannelInfo';

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

  return (
    <>
      {channelInfo && (
        <VersionChangePage
          channelInfo={channelInfo}
          onCancel={() => {
            setChannelInfo(null);
          }}
        />
      )}
    </>
  );
}

export default VersionChangeContainer;
