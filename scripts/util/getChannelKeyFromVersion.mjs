import semver from 'semver';

function getChannelKeyFromVersion(version) {
  if (semver.parse(version) == null) {
    throw new Error(`semver failed to parse "${version}".`);
  }

  const prerelease = semver.prerelease(version);
  if (prerelease == null) {
    return 'stable';
  } else if (prerelease.length > 0) {
    const prerelease0 = prerelease[0];
    if (prerelease0 === 'stable') {
      throw new Error(
        `"stable" is reserved for a version with no prerelease. Provided version was "${version}".`,
      );
    } else if (!prerelease0) {
      throw new Error(
        `semver parsed prerelease, but index 0 was falsy. Provided version was "${version}".`,
      );
    }

    return prerelease[0];
  } else {
    throw new Error(`semver parsed prerelease but has 0 length. Version was "${version}".`);
  }
}

export default getChannelKeyFromVersion;
