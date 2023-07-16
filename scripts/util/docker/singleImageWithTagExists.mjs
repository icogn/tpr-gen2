import {spawnSync} from 'node:child_process';
import semver from 'semver';

function singleImageWithTagExists(tag) {
  if (!tag) {
    throw new Error('Did not expect tag to be falsy.');
  }

  return singleImageExists(tag);
}

function singleImageExists(tag) {
  if (semver.parse(tag) == null) {
    throw new Error(`Invalid tag "${tag}" passed to findContainerForTag.`);
  }

  const result = spawnSync('docker', ['images', `tpr-generator:${tag}`]);
  const output = result.stdout.toString();

  if (!output.startsWith('REPOSITORY')) {
    return null;
  }

  const lines = output.split(/[\r\n]+/);

  let ret = false;

  for (let i = 1; i < lines.length; i++) {
    const imgVer = parseContainerLine(lines[i]);
    if (imgVer && imgVer === tag) {
      if (ret) {
        // Act as if there is nothing to do if we find multiple running containers
        // for this channels since we don't know which one to replace.
        return false;
      } else {
        ret = true;
      }
    }
  }

  return ret;
}

function parseContainerLine(line) {
  const reg = /tpr-generator\s+([a-z0-9:.\-_]+)\s+/i;

  const match = line.match(reg);
  if (!match) {
    return null;
  }

  const imageVersion = match[1];

  if (semver.parse(imageVersion) == null) {
    return null;
  }
  return imageVersion;
}

export default singleImageWithTagExists;
