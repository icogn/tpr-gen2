import {
  parseJson,
  configureRequestOptions,
  CancellationToken,
  // ProgressCallbackTransform,
} from 'builder-util-runtime';
import { httpExecutor } from 'builder-util/out/nodeHttpExecutor.js';
import { parse as parseUrl } from 'node:url';

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
          headers: { accept: 'application/vnd.github.v3+json' },
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

export default githubRequest;
