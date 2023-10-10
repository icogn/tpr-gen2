import semver from 'semver';
import fetchReleasesInfo from '../util/fetch/fetchReleasesInfo.mjs';

async function getChannelLatestReleaseInfo({ owner, repo, channelKey, exactVersion }) {
  const releases = await fetchReleasesInfo({ owner, repo });

  let latestRelease = null;
  let latestSemVer = null;

  for (const release of releases) {
    if (release.draft && !release.tag_name) {
      continue;
    }

    const version = release.tag_name[0] === 'v' ? release.tag_name.substring(1) : release.tag_name;

    const parsedVersion = semver.parse(version);
    if (parsedVersion == null) {
      continue;
    }

    const prerelease = semver.prerelease(version);
    if (channelKey === 'stable') {
      if (prerelease != null) {
        continue;
      }
    } else if (!prerelease || prerelease[0] !== channelKey) {
      continue;
    }

    if (exactVersion && version === exactVersion) {
      return {
        release,
        version,
      };
    }

    if (latestRelease) {
      if (semver.gt(parsedVersion, latestSemVer)) {
        latestRelease = release;
        latestSemVer = parsedVersion;
      }
    } else {
      latestRelease = release;
      latestSemVer = parsedVersion;
    }
  }

  if (!exactVersion && latestRelease && latestSemVer) {
    return {
      release: latestRelease,
      version: latestSemVer.version,
    };
  }

  return null;
}

export default getChannelLatestReleaseInfo;
