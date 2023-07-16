import semver from 'semver';
import {
  parseJson,
  configureRequestOptions,
  CancellationToken,
  // ProgressCallbackTransform,
} from 'builder-util-runtime';
import {httpExecutor} from 'builder-util/out/nodeHttpExecutor.js';
import {parse as parseUrl} from 'node:url';
// import {getVersion} from '../util/getVersion.mjs';
// import mime from 'mime';
// import fs from 'fs-extra';
// import getOwnerAndRepo from './getOwnerAndRepo.mjs';

function githubRequest(path, token, data, method) {
  const baseUrl = parseUrl('https://api.github.com');
  return parseJson(
    httpExecutor.request(
      configureRequestOptions(
        {
          protocol: baseUrl.protocol,
          hostname: baseUrl.hostname,
          port: baseUrl.port,
          path,
          headers: {accept: 'application/vnd.github.v3+json'},
          timeout: undefined,
        },
        token,
        method,
      ),
      new CancellationToken(),
      data,
    ),
  );
}

async function getChannelLatestReleaseInfo({owner, repo, channelKey}) {
  const releases = await githubRequest(`/repos/${owner}/${repo}/releases`, null, null, 'GET');

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

  if (latestRelease && latestSemVer) {
    return {
      release: latestRelease,
      version: latestSemVer.version,
    };
  }

  return null;
}

export default getChannelLatestReleaseInfo;
