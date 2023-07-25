import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import prepareDb from './prepareDb.mjs';

console.log('process.cwd()');
console.log(process.cwd());

const envObj = JSON.parse(fs.readFileSync('/app/website.env.json').toString());
await prepareDb(envObj);

// Spawn website
const result = spawnSync('node', ['/app/website-standalone/website/server.js'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    CAT_FROMSTART: 'CAT_FROMSTARTyes',
    // TODO: this should come from an actual secret
    NEXTAUTH_SECRET: 'publiclyVisibleNextAuthSecret',
    // This appears to be used to build the call on the client-side.
    // NEXTAUTH_URL: 'http://localhost:2999',
    NEXTAUTH_URL: 'http://new.trackerp.net',
  },
});

if (result.stderr) {
  const error = result.stderr.toString();
  if (error) {
    throw new Error(error);
  }
}

process.exit(typeof result.status === 'number' ? result.status : 1);
