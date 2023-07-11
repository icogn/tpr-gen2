import {URL} from 'node:url';
import type {AppUpdater, ResolvedUpdateFileInfo} from 'electron-updater';
import {NsisUpdater, MacUpdater, Provider, CancellationToken} from 'electron-updater';
import type {XElement, ReleaseNoteInfo} from 'builder-util-runtime';
import {
  type AllPublishOptions,
  type UpdateInfo,
  type GithubOptions,
  githubUrl,
  newError,
  parseXml,
  HttpError,
} from 'builder-util-runtime';
import type {ProviderRuntimeOptions} from 'electron-updater/out/providers/Provider';
import * as semver from 'semver';
import {
  getChannelFilename,
  newBaseUrl,
  newUrlFromBase,
  parseUpdateInfo,
  resolveFiles,
} from './updaterUtil';
import type {ChannelInfo} from '../../../shared/types';
import {channelInfoMatchesCurrentChannel} from '../channel';

const hrefRegExp = /\/tag\/([^/]+)$/;

interface GithubUpdateInfo extends UpdateInfo {
  tag: string;
}

interface GithubReleaseInfo {
  readonly tag_name: string;
}

interface CustomGithubOptions extends Omit<GithubOptions, 'provider'> {
  readonly provider: 'custom';
}

let _autoUpdater;

function doLoadAutoUpdater(options?: AllPublishOptions): AppUpdater {
  if (process.platform === 'win32') {
    _autoUpdater = new NsisUpdater(options);
  } else if (process.platform === 'darwin') {
    _autoUpdater = new MacUpdater(options);
  } else {
    throw new Error(`Unsupported process.platform for autoUpdater: "${process.platform}"`);
  }
  return _autoUpdater;
}

function githubUrlFromCustomOptions(options: CustomGithubOptions, defaultHost?: string) {
  const githubOptions: GithubOptions = {
    ...options,
    provider: 'github',
  };
  return githubUrl(githubOptions, defaultHost);
}

abstract class BaseGitHubProvider<T extends UpdateInfo> extends Provider<T> {
  // so, we don't need to parse port (because node http doesn't support host as url does)
  protected readonly baseUrl: URL;
  protected readonly baseApiUrl: URL;

  protected constructor(
    // protected readonly options: GithubOptions,
    protected readonly options: CustomGithubOptions,
    defaultHost: string,
    runtimeOptions: ProviderRuntimeOptions,
  ) {
    super({
      ...runtimeOptions,
      /* because GitHib uses S3 */
      isUseMultipleRangeRequest: false,
    });

    this.baseUrl = newBaseUrl(githubUrlFromCustomOptions(options, defaultHost));
    const apiHost = defaultHost === 'github.com' ? 'api.github.com' : defaultHost;
    this.baseApiUrl = newBaseUrl(githubUrlFromCustomOptions(options, apiHost));
  }

  protected computeGithubBasePath(result: string): string {
    // https://github.com/electron-userland/electron-builder/issues/1903#issuecomment-320881211
    const host = this.options.host;
    return host && !['github.com', 'api.github.com'].includes(host) ? `/api/v3${result}` : result;
  }
}

class CustomUpdaterProvider extends BaseGitHubProvider<GithubUpdateInfo> {
  constructor(
    // protected readonly options: GithubOptions,
    protected readonly options: CustomGithubOptions,
    private readonly updater: AppUpdater,
    runtimeOptions: ProviderRuntimeOptions,
  ) {
    super(options, 'github.com', runtimeOptions);
  }

  async getLatestVersion(): Promise<GithubUpdateInfo> {
    const targetChannel =
      this.updater?.channel ||
      (semver.prerelease(this.updater.currentVersion)?.[0] as string) ||
      null;

    const cancellationToken = new CancellationToken();

    const feedXml: string = (await this.httpRequest(
      newUrlFromBase(`${this.basePath}.atom`, this.baseUrl),
      {
        accept: 'application/xml, application/atom+xml, text/xml, */*',
      },
      cancellationToken,
    )) as string;

    const feed = parseXml(feedXml);

    const {latestRelease, tag} = await this.getTagAndReleaseFromFeed(
      targetChannel,
      feed,
      feedXml,
      cancellationToken,
    );

    if (tag == null) {
      throw newError('No published versions on GitHub', 'ERR_UPDATER_NO_PUBLISHED_VERSIONS');
    }

    let channelFile = '';
    let channelFileUrl: URL | undefined;
    const fetchData = async () => {
      // We keep this to where it is always called latest or latest-mac, etc.
      // Since we can update to any channel from any channel and channel B might
      // have not even existed when a release was created, we should only want a
      // single kind of file in any release regardless of its channel or
      // whatever channels exist.

      // `channelFile` looks like 'latest.yml', 'latest-mac.yml', etc.
      channelFile = getChannelFilename(this.getDefaultChannelName());
      channelFileUrl = newUrlFromBase(
        this.getBaseDownloadPath(String(tag), channelFile),
        this.baseUrl,
      );
      const requestOptions = this.createRequestOptions(channelFileUrl);
      requestOptions.timeout = 5000;
      try {
        const result = await this.executor.request(requestOptions, cancellationToken);
        if (result == null) {
          throw new Error(`channelFileUrl request did not return a string. result is ${result}`);
        }
        return result;
      } catch (e) {
        if (e instanceof HttpError && e.statusCode === 404) {
          throw newError(
            `Cannot find ${channelFile} in the latest release artifacts (${channelFileUrl}): ${
              e.stack || e.message
            }`,
            'ERR_UPDATER_CHANNEL_FILE_NOT_FOUND',
          );
        }
        throw e;
      }
    };

    // `rawData` will be the raw yaml from the latest.yml (latest-mac.yml,
    // etc.). This call can throw.
    const rawData: string = await fetchData();

    // `channelFile` and `channelFileUrl` are just passed to use in error
    // messages.
    const result = parseUpdateInfo(rawData, channelFile, channelFileUrl);

    // I think 'releaseName' and 'releaseNotes' can optionally be specified in
    // releaseInfo which can be used in the command line or the config. Docs say
    // it is intended for command line usage. Seems like we don't need to worry
    // about adding these things.
    if (result.releaseName == null) {
      result.releaseName = latestRelease?.elementValueOrEmpty('title') || '';
    }

    if (result.releaseNotes == null) {
      result.releaseNotes = computeReleaseNotes(
        this.updater.currentVersion,
        this.updater.fullChangelog,
        feed,
        latestRelease,
      );
    }
    return {
      tag: tag,
      ...result,
    };
  }

  // Note that feed is expected to only ever have at most 10 entries and order
  // of the releases is mostly ordered based on the time the release was created
  // rather than anything related to the tag. The order can be weird, and the
  // first element is not guaranteed to be the latest release. If looking for
  // the latest stable release, then a different endpoint is used. Since we can
  // only get the latest 10 without having to deal with github API limits
  // (though we are small enough to where we should probably be able to deal
  // with it if we needed to), it is not currently advised to have more than 1
  // prerelease type per repo.
  private async getTagAndReleaseFromFeed(
    targetChannel: string | null,
    feed: XElement,
    feedXml: string,
    cancellationToken: CancellationToken,
  ): Promise<{tag: string | null; latestRelease: XElement | null}> {
    // Note the below line will THROW with the 3rd param as the message if the
    // element was not found.
    feed.element('entry', false, 'No published versions on GitHub');

    let tag: string | null = null;
    let latestRelease: XElement | null = null;
    try {
      if (!targetChannel) {
        // Get the latest release always when channel is empty.
        tag = await this.getLatestTagName(cancellationToken);

        // Try to find latestRelease in entries.
        for (const element of feed.getElements('entry')) {
          const href = hrefRegExp.exec(element.element('link').attribute('href'));
          if (href && href[1] === tag) {
            latestRelease = element;
            break;
          }
        }
      } else {
        // From the releases we are given in the response, find the one which
        // has the highest version which matches the channel.

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

          if (hrefChannel === targetChannel && (tag == null || semver.gt(hrefTag, tag))) {
            tag = hrefTag;
            latestRelease = element;
          }
        }
      }
    } catch (e) {
      throw newError(
        `Cannot parse releases feed: ${e.stack || e.message},\nXML:\n${feedXml}`,
        'ERR_UPDATER_INVALID_RELEASE_FEED',
      );
    }

    return {
      tag,
      latestRelease,
    };
  }

  private async getLatestTagName(cancellationToken: CancellationToken): Promise<string | null> {
    const options = this.options;
    // do not use API for GitHub to avoid limit, only for custom host or GitHub Enterprise
    const url =
      options.host == null || options.host === 'github.com'
        ? newUrlFromBase(`${this.basePath}/latest`, this.baseUrl)
        : new URL(
            `${this.computeGithubBasePath(
              `/repos/${options.owner}/${options.repo}/releases`,
            )}/latest`,
            this.baseApiUrl,
          );
    try {
      const rawData = await this.httpRequest(url, {Accept: 'application/json'}, cancellationToken);
      if (rawData == null) {
        return null;
      }

      const releaseInfo: GithubReleaseInfo = JSON.parse(rawData);
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
      throw newError(
        `Unable to find latest version on GitHub (${url}), please ensure a production release exists: ${
          e.stack || e.message
        }`,
        'ERR_UPDATER_LATEST_VERSION_NOT_FOUND',
      );
    }
  }

  private get basePath(): string {
    return `/${this.options.owner}/${this.options.repo}/releases`;
    // return `/${this.options.owner}/${this.options.repo}/tags`;
  }

  resolveFiles(updateInfo: GithubUpdateInfo): Array<ResolvedUpdateFileInfo> {
    // still replace space to - due to backward compatibility
    return resolveFiles(updateInfo, this.baseUrl, p =>
      this.getBaseDownloadPath(updateInfo.tag, p.replace(/ /g, '-')),
    );
  }

  private getBaseDownloadPath(tag: string, fileName: string): string {
    return `${this.basePath}/download/${tag}/${fileName}`;
  }
}

function getNoteValue(parent: XElement | null): string {
  if (!parent) {
    return '';
  }
  const result = parent.elementValueOrEmpty('content');
  // GitHub reports empty notes as <content>No content.</content>
  return result === 'No content.' ? '' : result;
}

function computeReleaseNotes(
  currentVersion: semver.SemVer,
  isFullChangelog: boolean,
  feed: XElement,
  latestRelease: XElement | null,
): string | Array<ReleaseNoteInfo> | null {
  if (!isFullChangelog) {
    return getNoteValue(latestRelease);
  }

  const releaseNotes: Array<ReleaseNoteInfo> = [];
  for (const release of feed.getElements('entry')) {
    // noinspection TypeScriptValidateJSTypes
    const versionRegexResult = /\/tag\/v?([^/]+)$/.exec(release.element('link').attribute('href'));
    const versionRelease = versionRegexResult ? versionRegexResult[1] : '';
    if (semver.lt(currentVersion, versionRelease)) {
      releaseNotes.push({
        version: versionRelease,
        note: getNoteValue(release),
      });
    }
  }
  return releaseNotes.sort((a, b) => semver.rcompare(a.version, b.version));
}

// type UpdateEndpointDefinition = {
//   owner: string;
//   repo: string;
//   channel: string;
// };

export enum UpdateEndpoint {
  stable = 'stable',
  dev = 'dev',
  isaac = 'isaac',
}

export function createCustomAppUpdater(channelInfo: ChannelInfo) {
  const endpointOptions = {
    owner: channelInfo.owner,
    repo: channelInfo.repo,
    channel: channelInfo.channel,
  };

  // For example, we might say "dev" which translates to
  const options: AllPublishOptions = {
    ...endpointOptions,
    provider: 'custom',
    updateProvider: CustomUpdaterProvider,
  };

  const customAutoUpdater = doLoadAutoUpdater(options);
  // TODO: Only do in dev
  customAutoUpdater.channel = endpointOptions.channel;
  // Setting channel automatically sets `allowDowngrade` to true. We set it
  // manually here so this change is visible. Downgrades need to be allowed. For
  // example, it is possible for the semver for a non-stable channel to be
  // greater than the semver of the stable channel. If we do not allow
  // downgrades, then `isUpdateAvailable` will return false and the user will
  // not be allowed to swap to the stable channel even though they should be
  // able to. We need to take special care in the case of checking for updates
  // on startup to make sure that we do not allow downgrades in that case.

  // Note that swapping channels will always be allowed when `allowDowngrade` is
  // true assuming that the two channels do not have literally the same exact
  // version string ('1.2.3-dev.4' === '1.2.3-dev.4'). In this case, we would
  // not want to be able to update to something with an identical version since
  // it should be what we are already on. This is a valid case which might
  // happen if the user is on the latest dev version and they select the "dev"
  // option as if they wanted to swap to that channel. In that case, we would
  // still want to check for an update on that channel because (1) the user can
  // confirm they are on the latest version and (2) it is valid to manually
  // update to the latest version on the same channel you are already on.

  // If you have something like '1.2.3-dev.4' and '1.2.3-isaac.4', these two
  // things will not be equal because eventually the comparison will compare the
  // strings 'dev' and 'isaac' and one will be greater than the other (with a
  // simple `>` comparison).

  // TODO: check for autoUpdates of the same channel on startup. This one should
  // not allowDowngrades.

  // allowDowngrade should be false whenever you are checking for an update on
  // the channel you are already on.

  // TODO: need to handle data migration when someone is on dev, then swaps to
  // stable, then swaps back to dev but on an earlier build such that the
  // database would have different migrations. In this case, we would need to
  // completely reset the database. We probably also want to track somewhere in
  // the root volume what the latest stable version the user installed is. We
  // should NEVER allow downgrades on stable. We cannot control what happens on
  // non-stable channels by other developers, so we need to be able to handle
  // the case where the latest version on a non-stable channel is less than the
  // user's volume version for that channel.

  // For swapping branches, swap is allowed unless trying to swap to a stable
  // branch which is older than the latest stable branch the person has had.

  // For auto-check on startup, update is allowed as long as it is an increase.
  // TODO: should confirm version with site assuming site exists. Don't want to
  // update to a version which is newer than the site.

  // For simulating stable migration, save a file which indicates the current version,
  // the target version, and the volume which should be used.

  // On startup, should check if this file exists. If it does

  // When starting a simulated migration, should do the following:
  // - before starting download, first copy the volume of the current release to the new location.
  // - If this location already exists,
  // - create

  customAutoUpdater.allowDowngrade = !channelInfoMatchesCurrentChannel(channelInfo);
  customAutoUpdater.forceDevUpdateConfig = true;
  customAutoUpdater.allowPrerelease = true;
  customAutoUpdater.autoDownload = false;

  return customAutoUpdater;
}
