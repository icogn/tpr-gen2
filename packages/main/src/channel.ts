import {app} from 'electron';
import semver from 'semver';
import type {ChannelInfo} from '../../shared/types';

function computeChannelKey() {
  const appVersion = app.getVersion();
  if (semver.parse(appVersion) == null) {
    throw new Error(`Critical error: semver failed to parse app version "${appVersion}".`);
  }
  const prereleaseVal = semver.prerelease(appVersion);
  if (prereleaseVal == null) {
    return 'stable';
  }
  const channel = String(prereleaseVal[0]);
  if (!channel) {
    throw new Error(`Failed to parse channel from appVersion "${appVersion}".`);
  }
  return channel;
}

export const channelKey = computeChannelKey();

export function channelInfoMatchesCurrentChannel({channel}: ChannelInfo) {
  const channelKeyIn = channel === '' ? 'stable' : channel;
  return channelKeyIn === channelKey;
}
