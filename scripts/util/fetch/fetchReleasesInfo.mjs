import path from 'node:path';
import getEnsureCacheDir from '../cache/getEnsureCacheDir.mjs';
import githubRequest from './githubRequest.mjs';
import { cacheData, tryGetCachedData } from '../cache/cachedData.mjs';

async function fetchReleasesInfo({ owner, repo }) {
  if (!owner || !repo) {
    throw new Error(`owner and repo required. Received owner "${owner}" and repo "${repo}".`);
  }

  const cacheDir = getEnsureCacheDir();
  const cacheFilePath = path.join(cacheDir, 'fetchReleaseInfo', owner, `${repo}.json`);

  let releases = tryGetCachedData(cacheFilePath);
  if (!releases) {
    releases = await githubRequest(`/repos/${owner}/${repo}/releases`, null, null, 'GET');
    cacheData(cacheFilePath, releases);
  }

  return releases;
}

export default fetchReleasesInfo;
