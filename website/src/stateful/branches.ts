interface GithubReleaseInfo {
  readonly tag_name: string;
}

type RawChannelInfo = {
  name: string;
  owner: string;
  repo: string;
  site: URL;
};

interface ChannelInfo extends RawChannelInfo {
  channel: string;
  // `latestVersion` can be missing since we have to fetch it for each
  // individual channel and we don't want to fail the entire thing if we fail to
  // get the version for a single channel.
  latestVersion?: string;
}

const REQUEST_CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

let cachedData: ChannelInfo[] = [];
let lastCacheTimestamp = -1;

function withinCacheTime() {
  return Date.now() - lastCacheTimestamp < REQUEST_CACHE_DURATION;
}

export async function fetchBranchesConfig() {
  if (cachedData.length > 0 && withinCacheTime()) {
    return cachedData;
  }

  try {
    const res = await fetch(
      'https://raw.githubusercontent.com/icogn/tpr-gen2/main/staticApi/branches.json',
    );
    const responseText = await res.text();
    const config = JSON.parse(responseText);

    if (config && typeof config === 'object') {
      const channelInfoArr: ChannelInfo[] = [];

      const keys = Object.keys(config);
      for (let i = 0; i < keys.length; i++) {
        const rawChannel = keys[i];

        const channel = rawChannel === 'stable' ? '' : rawChannel;
        const channelInfo = {
          ...config[rawChannel],
          channel,
        };

        const latestVersion = await fetchBranchLatestVersion(channelInfo);
        channelInfo.latestVersion = latestVersion;

        channelInfoArr.push(channelInfo);
      }

      cachedData = channelInfoArr;
      lastCacheTimestamp = Date.now();
    }
  } catch (e) {
    console.error('Failed to fetch branches config.');
    console.error(e);
  }

  return cachedData;
}

async function fetchBranchLatestVersion(channelInfo: ChannelInfo): string | undefined {
  try {
    if (!channelInfo.channel) {
      // Fetch the latest if the channel is '' (the stable channel)
      return await getLatestTagName(channelInfo);
    } else {
      // Get the latest semver tag for the given channel in the list of recent
      // releases returned from Github.
    }
  } catch (e) {
    console.error(`Failed to fetch latestVersion for channel "${channelInfo.channel}":`);
    console.error(e);
  }

  return undefined;
}

export function newUrlFromBase(
  pathname: string,
  baseUrl: URL,
  addRandomQueryToAvoidCaching = false,
): URL {
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

async function getLatestTagName(channelInfo: ChannelInfo): Promise<string | undefined> {
  // Do not use API for GitHub to avoid limit
  const url = newUrlFromBase(
    `/${channelInfo.owner}/${channelInfo.repo}/releases/latest`,
    new URL('https://github.com/'),
  );
  try {
    const releaseInfo: GithubReleaseInfo = await fetch(url, {
      headers: {Accept: 'application/json'},
    }).then(res => res.json());

    return releaseInfo.tag_name;
  } catch (e) {
    console.error(
      `Unable to find latest version on GitHub (${url}), please ensure a production release exists: ${
        e.stack || e.message
      }`,
    );
  }
  return undefined;
}
