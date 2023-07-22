import path from 'node:path';
import getEnsureCacheDir from '../cache/getEnsureCacheDir.mjs';
import {cacheData, tryGetCachedData} from '../cache/cachedData.mjs';

async function fetchData() {
  const res = await fetch(
    'https://raw.githubusercontent.com/icogn/tpr-gen2/main/staticApi/branches.json',
  );
  const responseText = await res.text();
  return JSON.parse(responseText);
}

async function fetchChannels() {
  const cacheDir = getEnsureCacheDir();
  const cacheFilePath = path.join(cacheDir, 'fetchChannels.json');

  let data = tryGetCachedData(cacheFilePath);
  if (!data) {
    data = await fetchData();
    cacheData(cacheFilePath, data);
  }

  return data;
}

export default fetchChannels;
