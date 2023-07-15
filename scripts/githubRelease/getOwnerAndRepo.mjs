import path from 'node:path';
import fs from 'fs-extra';
import getRootDir from '../util/getRootDir.mjs';
import hostedGitInfo from 'hosted-git-info';

async function getGitUrlFromGitConfig(projectDir) {
  let data;
  try {
    data = await fs.readFile(path.join(projectDir, '.git', 'config'), 'utf8');
  } catch (e) {
    // do nothing
  }
  if (data == null) {
    return null;
  }

  const conf = data.split(/\r?\n/);
  const i = conf.indexOf('[remote "origin"]');
  if (i !== -1) {
    let u = conf[i + 1];
    if (!/^\s*url =/.exec(u)) {
      u = conf[i + 2];
    }

    if (/^\s*url =/.exec(u)) {
      return u.replace(/^\s*url = /, '');
    }
  }
  return null;
}

function parseRepositoryUrl(url) {
  const info = hostedGitInfo.fromUrl(url);
  if (info == null) {
    return null;
  }
  delete info.protocols;
  delete info.treepath;
  delete info.filetemplate;
  delete info.bugstemplate;
  delete info.gittemplate;
  delete info.tarballtemplate;
  delete info.sshtemplate;
  delete info.sshurltemplate;
  delete info.browsetemplate;
  delete info.docstemplate;
  delete info.httpstemplate;
  delete info.shortcuttemplate;
  delete info.pathtemplate;
  delete info.pathmatch;
  delete info.protocols_re;
  delete info.committish;
  delete info.default;
  delete info.opts;
  delete info.browsefiletemplate;
  delete info.auth;
  return info;
}

async function getOwnerAndRepo() {
  const rootDir = getRootDir();
  const url = await getGitUrlFromGitConfig(rootDir);

  if (!url) {
    throw new Error('Failed to get git url from git config.');
  }

  const repoInfo = parseRepositoryUrl(url);

  return {
    owner: repoInfo.user,
    repo: repoInfo.project,
  };
}

export default getOwnerAndRepo;
