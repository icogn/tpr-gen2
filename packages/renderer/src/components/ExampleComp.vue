<script lang="ts" setup>
import {ref, onMounted} from 'vue';
import {cancelAutoInstall, askDbReady, askWebsiteReady} from '#preload';

type ChannelInfo = {
  name: string;
  owner: string;
  repo: string;
  // site should be either an empty string or a URL
  site: string;
  channel: string;
  // `latestVersion` can be missing since we have to fetch it for each
  // individual channel and we don't want to fail the entire thing if we fail to
  // get the version for a single channel.
  latestVersion?: string;
};

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

const dbReady = ref('pending');
const websiteReady = ref('pending');

function handleChangeChannel(channelInfo: ChannelInfo) {
  console.log('in handleChangeChannel, channelInfo');
  console.log(channelInfo);
}

onMounted(() => {
  console.log('window.origin');
  console.log(window.origin);

  askDbReady().then((response: boolean) => {
    console.log(`dbResponseIfReady:${response}`);
    dbReady.value = String(response);
  });

  askWebsiteReady().then((response: boolean) => {
    console.log(`websiteResponseIfReady:${response}`);
    websiteReady.value = String(response);
  });

  window.addEventListener('message', e => {
    console.log(e);
    const url = new URL(e.origin);
    if (url.hostname === 'localhost') {
      const {data} = e;
      if (data.type === 'changeToChannel' && data.channelInfo) {
        if (isObjectChannelInfo(data.channelInfo)) {
          console.log('object is channelInfo');
          handleChangeChannel(data.channelInfo as ChannelInfo);
        } else {
          console.log('object is NOT channelInfo');
        }
      }
    }
  });
});

function doCancelAutoInstall() {
  console.log('cancel auto install');
  cancelAutoInstall();
}
</script>

<template>
  <div>ExampleComp</div>
  <div>dbReady: {{ dbReady }}</div>
  <div>websiteReady: {{ websiteReady }}</div>
  <button @click="doCancelAutoInstall">cancelAutoInstall</button>
</template>
