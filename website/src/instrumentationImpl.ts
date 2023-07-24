import fs from 'node:fs';
import path from 'node:path';
import searchUpFileTree from './util/searchUpFileTree';

// Note: env from .env file is available at this point.

// secrets mounted at `/run/secrets/...`

if (process.env.NODE_ENV === 'production') {
  process.env.DOG = 'DOG_VAL_PRODUCTION';

  // TODO: need to handle for production electron.
} else {
  process.env.DOG = 'DOG_VAL_DEVELOPMENT';

  // Load website env from `tmp/website.env.json`. We have to load it this way
  // since debugging the Next server is very picky about how it gets run.
  const rootDir = searchUpFileTree(__dirname, currPath => {
    return fs.existsSync(path.join(currPath, '.git'));
  });
  if (!rootDir) {
    throw new Error('Failed to find rootDir');
  }
  const envObjFilePath = path.join(rootDir, 'tmp/website.env.json');

  const contents = fs.readFileSync(envObjFilePath).toString();
  const envObj = JSON.parse(contents);

  Object.keys(envObj).forEach(key => {
    process.env[key] = envObj[key];
  });
}
