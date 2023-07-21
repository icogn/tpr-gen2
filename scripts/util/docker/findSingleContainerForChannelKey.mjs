import {spawnSync} from 'node:child_process';
import semver from 'semver';

function findContainerForChannelKey(channelKey) {
  const result = spawnSync('docker', ['ps']);
  const output = result.stdout.toString();

  if (!output.startsWith('CONTAINER ID')) {
    return null;
  }

  const lines = output.split(/[\r\n]+/);

  let numContainers = 0;
  let containerInfo = null;

  for (let i = 1; i < lines.length; i++) {
    const parsed = parseContainerLine(lines[i], channelKey);
    if (parsed) {
      numContainers += 1;
      containerInfo = parsed;
    }
  }

  return {
    numContainers,
    containerInfo: numContainers === 1 ? containerInfo : null,
  };
}

function parseContainerLine(line, desiredChannelKey) {
  const reg = /([0-9a-f]+)\s+(tpr-generator:([a-z0-9:.\-_]+))/i;

  const match = line.match(reg);
  if (!match) {
    return null;
  }

  const imageVersion = match[3];

  if (semver.parse(imageVersion) == null) {
    return null;
  }

  const prerelease = semver.prerelease(imageVersion);

  if (
    (prerelease == null && desiredChannelKey === 'stable') ||
    desiredChannelKey === prerelease[0]
  ) {
    return {
      containerId: match[1],
      image: match[2],
      imageVersion: match[3],
    };
  }

  return null;
}

export default findContainerForChannelKey;
