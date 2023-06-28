// import {ref, onMounted} from 'vue';
import {cancelAutoInstall, askDbReady, askWebsiteReady} from '#preload';
import {useEffect, useState} from 'react';
// import VersionChangePopup from './VersionChangePopup.vue';
import type {ChannelInfo} from './RendererTypes';
import VersionChangePopup from './VersionChangePopup';

const channelProps = {
  name: 'string',
  owner: 'string',
  repo: 'string',
  // `site` should be either an empty string or a URL
  site: 'siteProp',
  channel: 'string',
  latestVersion: '?string',
};

function isObjectChannelInfo(data: unknown): boolean {
  if (typeof data !== 'object' || !data) {
    return false;
  }
  const obj = data as {[key: string]: unknown};

  const propKeys = Object.keys(channelProps) as (keyof typeof channelProps)[];
  for (let i = 0; i < propKeys.length; i++) {
    const propKey = propKeys[i];
    const rawVal = channelProps[propKey];
    const optional = rawVal[0] === '?';

    if (!optional && !(propKey in obj)) {
      // non-optional property is missing
      return false;
    }

    const valOnObj = obj[propKey];
    if (optional && valOnObj === undefined) {
      continue;
    }

    const desiredType = optional ? rawVal.substring(1) : rawVal;
    switch (desiredType) {
      case 'string': {
        if (typeof valOnObj !== 'string') {
          console.log('not string');
          return false;
        }
        break;
      }
      case 'siteProp': {
        try {
          if (typeof valOnObj === 'string') {
            if (valOnObj.length > 0) {
              new URL(valOnObj);
            }
          } else {
            return false;
          }
        } catch (e) {
          return false;
        }
        break;
      }
      default:
        throw new Error(`Cannot check if property "${propKey}" is "${desiredType}".`);
    }
  }

  return true;
}

function handleCancelAutoInstall() {
  console.log('cancel auto install');
  cancelAutoInstall();
}

function ExampleComp() {
  const [dbReady, setDbReady] = useState('pending');
  const [websiteReady, setWebsiteReady] = useState('pending');
  const [channelInfo, setChannelInfo] = useState<ChannelInfo | null>(null);

  useEffect(() => {
    console.log('window.origin');
    console.log(window.origin);

    askDbReady().then((response: boolean) => {
      console.log(`dbResponseIfReady:${response}`);
      setDbReady(String(response));
    });

    askWebsiteReady().then((response: boolean) => {
      console.log(`websiteResponseIfReady:${response}`);
      setWebsiteReady(String(response));
    });
  }, [setDbReady, setWebsiteReady]);

  useEffect(() => {
    const msgListener = (e: MessageEvent) => {
      console.log(e);
      const url = new URL(e.origin);
      if (url.hostname === 'localhost') {
        const {data} = e;
        if (data.type === 'changeToChannel' && data.channelInfo) {
          if (isObjectChannelInfo(data.channelInfo)) {
            console.log('object is channelInfo');
            setChannelInfo(data.channelInfo);
          } else {
            console.log('object is NOT channelInfo');
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
      <div>ExampleComp</div>
      <div>dbReady: {dbReady}</div>
      <div>websiteReady: {websiteReady}</div>
      <button onClick={handleCancelAutoInstall}>cancelAutoInstall</button>
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

// {/* <button @click="doCancelAutoInstall">cancelAutoInstall</button> */}
// // <version-change-popup
// //   v-if="channelInfo != null"
// //   :channel-info="channelInfo"
// //   :on-cancel="handleCancel"
// // ></version-change-popup>

export default ExampleComp;
