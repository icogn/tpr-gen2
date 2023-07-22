import fetchChannels from './fetchChannels.mjs';

async function fetchChannelObj(channelKey) {
  const channelsConfig = await fetchChannels();

  if (!channelsConfig[channelKey]) {
    return null;
  }

  return {
    ...channelsConfig[channelKey],
    channelKey,
  };
}

export default fetchChannelObj;
