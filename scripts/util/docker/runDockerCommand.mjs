import {spawnSync} from 'node:child_process';

export function loadDockerImage(imagePath) {
  const result = spawnSync('docker', ['load', '-i', imagePath]);
  return result.status === 0;
}

export function stopContainerById(containerId) {
  const result = spawnSync('docker', ['stop', containerId]);
  return result.status === 0;
}

export function rmContainerById(containerId) {
  const result = spawnSync('docker', ['rm', containerId]);
  return result.status === 0;
}

function imageExists(image) {
  const result = spawnSync('docker', ['images', '-q', image]);
  if (result.status !== 0) {
    throw new Error(`Failed to check if docker image "${image}" exists.`);
  }
  return Boolean(result.stdout.toString());
}

export function rmImageByTagIfExists(tag) {
  const image = `tpr-generator:${tag}`;
  if (!imageExists(image)) {
    return true;
  }
  const result = spawnSync('docker', ['image', 'rm', image]);
  if (result.status === 0) {
    return true;
  }
  const error = result.stderr ? result.stderr.toString() : '';
  return Boolean(error && error.indexOf(`No such image: ${image}`) >= 0);
}
