import {spawnSync} from 'node:child_process';
import semver from 'semver';

function singleImageWithTagExists(tag) {
  if (!tag) {
    throw new Error('Did not expect tag to be falsy.');
  }

  return findContainerForTag(tag);
}

function findContainerForTag(tag) {
  if (semver.parse(tag) == null) {
    throw new Error(`Invalid tag "${tag}" passed to findContainerForTag.`);
  }

  const result = spawnSync('docker', ['images', `tpr-generator:${tag}`]);
  const output = result.stdout.toString();

  if (!output.startsWith('CONTAINER ID')) {
    return null;
  }

  const lines = output.split(/[\r\n]+/);

  let ret = null;

  for (let i = 1; i < lines.length; i++) {
    const parsed = parseContainerLine(lines[i]);
    if (parsed && parsed.imageVersion === tag) {
      if (ret) {
        // Act as if there is nothing to do if we find multiple running containers
        // for this channels since we don't know which one to replace.
        return null;
      } else {
        ret = parsed;
      }
    }
  }

  return ret;
}

function parseContainerLine(line) {
  const reg = /([0-9a-f]+)\s+(tpr-generator:([a-z0-9:.\-_]+))/i;

  const match = line.match(reg);
  if (!match) {
    return null;
  }

  const imageVersion = match[3];

  if (semver.parse(imageVersion) == null) {
    return null;
  }

  return {
    containerId: match[1],
    image: match[2],
    imageVersion: match[3],
  };
}

export default singleImageWithTagExists;
