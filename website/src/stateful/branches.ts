import {parseXml} from 'builder-util-runtime';
import * as semver from 'semver';

interface GithubReleaseInfo {
  readonly tag_name: string;
}

type RawChannelInfo = {
  name: string;
  owner: string;
  repo: string;
  // site should be either an empty string or a URL
  site: string;
};

export interface ChannelInfo extends RawChannelInfo {
  channel: string;
  // `latestVersion` can be missing since we have to fetch it for each
  // individual channel and we don't want to fail the entire thing if we fail to
  // get the version for a single channel.
  latestVersion?: string;
}

const cacheDuration = 10 * 60 * 1000; // 10 minutes
const baseUrl = newBaseUrl('https://github.com');
const hrefRegExp = /\/tag\/([^/]+)$/;

function newBaseUrl(url: string): URL {
  const result = new URL(url);
  if (!result.pathname.endsWith('/')) {
    result.pathname += '/';
  }
  return result;
}

let cachedData: ChannelInfo[] = [];
let lastCacheTimestamp = -1;

function withinCacheTime() {
  return Date.now() - lastCacheTimestamp < cacheDuration;
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
        const channelKey = keys[i];

        const channelInfo = {
          ...config[channelKey],
          channel: channelKey === 'stable' ? '' : channelKey,
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

async function fetchBranchLatestVersion(channelInfo: ChannelInfo): Promise<string | undefined> {
  try {
    if (!channelInfo.channel) {
      // Fetch the latest if the channel is '' (the stable channel)
      return await getLatestTagName(channelInfo);
    } else {
      // Get the latest semver tag for the given channel in the list of recent
      // releases returned from Github.
      return await getLatestTagForNonStableChannel(channelInfo);
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

function getBasePath({owner, repo}: ChannelInfo) {
  return `/${owner}/${repo}/releases`;
}

async function getLatestTagName(channelInfo: ChannelInfo): Promise<string | undefined> {
  // Do not use API for GitHub to avoid limit
  const url = newUrlFromBase(`${getBasePath(channelInfo)}/latest`, new URL('https://github.com/'));
  try {
    const releaseInfo: GithubReleaseInfo = await fetch(url, {
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

async function getLatestTagForNonStableChannel(
  channelInfo: ChannelInfo,
): Promise<string | undefined> {
  let tag: string | undefined = undefined;

  try {
    const feedXml = await fetch(newUrlFromBase(`${getBasePath(channelInfo)}.atom`, baseUrl), {
      headers: {
        Accept: 'application/xml, application/atom+xml, text/xml, */*',
      },
    }).then(res => res.text());

    const feed = parseXml(feedXml);

    for (const element of feed.getElements('entry')) {
      const hrefElement = hrefRegExp.exec(element.element('link').attribute('href'));
      // If this is null then something is wrong and skip this release
      if (hrefElement == null) {
        continue;
      }

      // This release's tag
      const hrefTag = hrefElement[1];
      // Get channel from this release's tag
      const hrefChannel = (semver.prerelease(hrefTag)?.[0] as string) || null;

      if (hrefChannel === channelInfo.channel && (tag == null || semver.gt(hrefTag, tag))) {
        tag = hrefTag;
      }
    }
  } catch (e) {
    console.error(`Failed to get latest tag for channel "${channelInfo.channel}".`);
    console.error(e);
  }

  return tag;
}
