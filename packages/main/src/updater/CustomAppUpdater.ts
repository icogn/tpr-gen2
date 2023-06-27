import {URL} from 'node:url';
import type {AppUpdater, ProgressInfo, ResolvedUpdateFileInfo} from 'electron-updater';
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
      return releaseInfo.tag_name;
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

type UpdateEndpointDefinition = {
  owner: string;
  repo: string;
  channel: string;
};

export enum UpdateEndpoint {
  stable = 'stable',
  dev = 'dev',
  isaac = 'isaac',
}

const endpointDefs: {[key: string]: UpdateEndpointDefinition} = {
  stable: {
    owner: 'icogn',
    repo: 'tpr-gen2',
    channel: '',
  },
  dev: {
    owner: 'icogn',
    repo: 'tpr-gen2',
    // owner: 'electron-userland',
    // repo: 'electron-builder',
    channel: 'dev',
  },
  // TODO: create 'isaac' one in a new github account.
};

export function createCustomAppUpdater(updateEndpoint: UpdateEndpoint) {
  // TODO: need a way to specify channel.
  const endpointOptions = endpointDefs[updateEndpoint];
  if (!endpointOptions) {
    throw new Error(`Could not find updateEndpointDefinition for "${updateEndpoint}"`);
  }

  // For example, we might say "dev" which translates to
  const options: AllPublishOptions = {
    ...endpointOptions,
    provider: 'custom',
    updateProvider: CustomUpdaterProvider,
  };

  const customAutoUpdater = doLoadAutoUpdater(options);
  // TODO: Only do in dev
  customAutoUpdater.channel = endpointOptions.channel;
  // Setting channel automatically sets `allowDowngrade` to true. We probably do
  // not want this since I think it makes the app automatically update to
  // whatever the resolved "client.getLatestVersion()" is when that semver
  // resolved to a lower value than the current one. Meaning that any change in
  // the version such that it does not match the current version (higher or
  // lower) would cause us to update to it. The only time we would want to
  // downgrade (which will likely NEVER be allowed on the "stable" releases due
  // to messing up people's databases) would be when a user specifies an exact
  // version they want to swap to. That is a feature that would have to be
  // developed, and I am not sure if there is much point since the generator
  // server will probably always be on the latest version, so if the user
  // swapped to a version which did not match the server, then they would not be
  // able to interact with the server.
  customAutoUpdater.allowDowngrade = false;
  customAutoUpdater.forceDevUpdateConfig = true;
  customAutoUpdater.allowPrerelease = true;

  customAutoUpdater.on('download-progress', (progressInfo: ProgressInfo) => {
    console.log(`percent:${progressInfo.percent}`);
  });

  return customAutoUpdater;
}
