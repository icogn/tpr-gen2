import {execSync} from 'node:child_process';
import getRootDir from './getRootDir.mjs';

function getGitCommitHash() {
  const gitCommitHash = execSync('git rev-parse HEAD', {
    cwd: getRootDir(),
    encoding: 'utf8',
  });

  if (!gitCommitHash) {
    throw new Error('Failed to determine git commit hash.');
  }

  return gitCommitHash.substring(0, 12);
}

export default getGitCommitHash;
