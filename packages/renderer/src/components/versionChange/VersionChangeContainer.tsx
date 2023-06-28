import {useEffect, useState} from 'react';
import VersionChangePopup from './VersionChangePopup';
import type {ChannelInfo} from '../RendererTypes';
import isObjectChannelInfo from './isObjectChannelInfo';

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
        <VersionChangePopup
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
