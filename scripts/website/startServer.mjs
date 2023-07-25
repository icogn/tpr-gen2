import {spawnSync} from 'node:child_process';

console.log('process.cwd()');
console.log(process.cwd());

const result = spawnSync('node', ['/app/website-standalone/website/server.js'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    CAT_FROMSTART: 'CAT_FROMSTARTyes',
    // TODO: this should come from an actual secret
    NEXTAUTH_SECRET: 'publiclyVisibleNextAuthSecret',
  },
});

if (result.stderr) {
  const error = result.stderr.toString();
  if (error) {
    throw new Error(error);
  }
}

process.exit(typeof result.status === 'number' ? result.status : 1);
