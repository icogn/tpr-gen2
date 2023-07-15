import {
  parseJson,
  configureRequestOptions,
  CancellationToken,
  ProgressCallbackTransform,
} from 'builder-util-runtime';
import {httpExecutor} from 'builder-util/out/nodeHttpExecutor.js';
import {parse as parseUrl} from 'node:url';
import {getVersion} from '../util/getVersion.mjs';
import mime from 'mime';
import fs from 'fs-extra';
import getOwnerAndRepo from './getOwnerAndRepo.mjs';

const {owner, repo} = await getOwnerAndRepo();
const version = getVersion();
const tag = `v${version}`;
const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN || null;
if (token == null) {
  throw new Error('GitHub token was null.');
}

function githubRequest(path, token, data, method) {
  const baseUrl = parseUrl('https://api.github.com');
  return parseJson(
    httpExecutor.request(
      configureRequestOptions(
        {
          protocol: baseUrl.protocol,
          hostname: baseUrl.hostname,
          port: baseUrl.port,
          path,
          headers: {accept: 'application/vnd.github.v3+json'},
          timeout: undefined,
        },
        token,
        method,
      ),
      new CancellationToken(),
      data,
    ),
  );
}

function doesErrorMeanAlreadyExists(e) {
  if (!e.description) {
    return false;
  }
  const desc = e.description;
  const descIncludesAlreadyExists =
    (desc.includes('errors') && desc.includes('already_exists')) ||
    (desc.errors && desc.errors.length >= 1 && desc.errors[0].code === 'already_exists');
  return e.statusCode === 422 && descIncludesAlreadyExists;
}

async function overwriteArtifact(fileName, release) {
  // Delete old artifact and re-upload
  console.log(`Trying to delete file "${fileName}". Already exists on GitHub.`);

  const assets = await githubRequest(
    `/repos/${owner}/${repo}/releases/${release.id}/assets`,
    token,
    null,
  );
  for (const asset of assets) {
    if (asset.name === fileName) {
      await githubRequest(
        `/repos/${owner}/${repo}/releases/assets/${asset.id}`,
        token,
        null,
        'DELETE',
      );
      return;
    }
  }

  console.log(`File "${fileName}" not found on GitHub. Trying to upload again.`);
}

function doUploadFile(attemptNumber, parsedUrl, fileName, dataLength, requestProcessor, release) {
  console.log(`Trying to upload file "${fileName}", attempt number ${attemptNumber}...`);
  return httpExecutor
    .doApiRequest(
      configureRequestOptions(
        {
          protocol: parsedUrl.protocol,
          hostname: parsedUrl.hostname,
          path: parsedUrl.path,
          method: 'POST',
          headers: {
            accept: 'application/vnd.github.v3+json',
            'Content-Type': mime.getType(fileName) || 'application/octet-stream',
            'Content-Length': dataLength,
          },
          timeout: undefined,
        },
        token,
      ),
      new CancellationToken(),
      requestProcessor,
    )
    .catch(e => {
      if (attemptNumber > 3) {
        return Promise.reject(e);
      } else if (doesErrorMeanAlreadyExists(e)) {
        return overwriteArtifact(fileName, release).then(() =>
          doUploadFile(
            attemptNumber + 1,
            parsedUrl,
            fileName,
            dataLength,
            requestProcessor,
            release,
          ),
        );
      } else {
        return new Promise((resolve, reject) => {
          const newAttemptNumber = attemptNumber + 1;
          setTimeout(() => {
            doUploadFile(
              newAttemptNumber,
              parsedUrl,
              fileName,
              dataLength,
              requestProcessor,
              release,
            )
              .then(resolve)
              .catch(reject);
          }, newAttemptNumber * 2000);
        });
      }
    });
}

function createReadStreamAndProgressBar(file, fileStat, progressBar, reject) {
  const fileInputStream = fs.createReadStream(file);
  fileInputStream.on('error', reject);

  if (progressBar == null) {
    return fileInputStream;
  } else {
    const progressStream = new ProgressCallbackTransform(
      fileStat.size,
      this.context.cancellationToken,
      it => progressBar.tick(it.delta),
    );
    progressStream.on('error', reject);
    return fileInputStream.pipe(progressStream);
  }
}

async function getRelease() {
  const releases = await githubRequest(`/repos/${owner}/${repo}/releases`, token, null, 'GET');

  for (const release of releases) {
    if (!(release.tag_name === tag || release.tag_name === version)) {
      continue;
    }

    if (release.draft) {
      return release;
    }
  }

  throw new Error('Failed to find release.');
}

async function main() {
  const release = await getRelease();

  const fileName = 'exampleImage.txt';

  const fileStat = await fs.stat(fileName);
  const dataLength = fileStat.size;

  const parsedUrl = parseUrl(
    `${release.upload_url.substring(0, release.upload_url.indexOf('{'))}?name=${fileName}`,
  );

  await doUploadFile(
    0,
    parsedUrl,
    fileName,
    dataLength,
    (request, reject) => {
      return createReadStreamAndProgressBar(fileName, fileStat, null, reject).pipe(request);
    },
    release,
  );
}

main();
