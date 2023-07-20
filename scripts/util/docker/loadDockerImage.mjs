import {spawnSync} from 'node:child_process';

function loadDockerImage(imagePath) {
  const result = spawnSync('docker', ['load', '-i', imagePath]);
  return result.status === 0;
}

export default loadDockerImage;
