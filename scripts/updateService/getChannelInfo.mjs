import semver from 'semver';
import fetchChannels from '../util/fetch/fetchChannels.mjs';

async function getChannelInfo() {
  try {
    const config = await fetchChannels();

    if (config && typeof config === 'object') {
      const channelInfoArr = [];

      const keys = Object.keys(config);
      for (let i = 0; i < keys.length; i++) {
        const channelKey = keys[i];

        const channelInfo = {
          ...config[channelKey],
          channel: channelKey === 'stable' ? '' : channelKey,
        };

        const latestVersion = await fetchBranchLatestVersion(channelInfo);
        channelInfo.latestVersion = latestVersion;

        channelInfoArr.push(channelInfo);
      }

      return channelInfoArr;
      // cachedData = channelInfoArr;
      // lastCacheTimestamp = Date.now();
    }
  } catch (e) {
    console.error('Failed to fetch branches config.');
    console.error(e);
  }

  return 7;
}

async function fetchBranchLatestVersion(channelInfo) {
  try {
    if (!channelInfo.channel) {
      // Fetch the latest if the channel is '' (the stable channel)
      return await getLatestTagName(channelInfo);
    } else {
      // Get the latest semver tag for the given channel in the list of recent
      // releases returned from Github.
      // return await getLatestTagForNonStableChannel(channelInfo);
      return null;
    }
  } catch (e) {
    console.error(`Failed to fetch latestVersion for channel "${channelInfo.channel}":`);
    console.error(e);
  }

  return undefined;
}

async function getLatestTagName(channelInfo) {
  // Do not use API for GitHub to avoid limit
  const url = newUrlFromBase(`${getBasePath(channelInfo)}/latest`, new URL('https://github.com/'));
  try {
    const releaseInfo = await fetch(url, {
      headers: {Accept: 'application/json'},
    }).then(res => res.json());

    const {tag_name} = releaseInfo;

    if (semver.parse(tag_name) == null) {
      throw new Error(`semver failed to parse tag_name ${tag_name}`);
    } else if (semver.prerelease(tag_name) != null) {
      throw new Error(
        `"latest" release tag should never include a semver prerelease, but was ${tag_name}. Did someone publish a non-stable release as "latest" instead of "prerelease"? You can edit this in GitHub.`,
      );
    }

    return tag_name;
  } catch (e) {
    console.error(
      `Unable to find latest version on GitHub (${url}), please ensure a production release exists: ${
        e.stack || e.message
      }`,
    );
  }
  return undefined;
}

export function newUrlFromBase(pathname, baseUrl, addRandomQueryToAvoidCaching) {
  const result = new URL(pathname, baseUrl);
  // search is not propagated (search is an empty string if not specified)
  const search = baseUrl.search;
  if (search != null && search.length !== 0) {
    result.search = search;
  } else if (addRandomQueryToAvoidCaching) {
    result.search = `noCache=${Date.now().toString(32)}`;
  }
  return result;
}

function getBasePath({owner, repo}) {
  return `/${owner}/${repo}/releases`;
}

export default getChannelInfo;
