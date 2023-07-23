import path from 'node:path';
import {fileURLToPath} from 'node:url';
import fs from 'fs-extra';
import {spawnSync} from 'node:child_process';
import {
  checkThrowSpawnSyncResult,
  serviceDir,
  serviceFilePath,
  serviceNameNoExt,
} from './linuxServiceShared.mjs';

// Note: you may need to add sudo when you run this. If it still fails, you can
// always do the steps in this file manually.

// Note: you can follow the live logs with the command `journalctl -f`.

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const templatePath = path.join(__dirname, 'serviceTemplate.txt');
const serviceImplPath = path.resolve(path.join(__dirname, '../serviceImpl.mjs'));

function replaceExecStart(contents) {
  const result = spawnSync('which', ['node']);
  checkThrowSpawnSyncResult(result);
  const output = result.stdout.toString().trim();
  if (!output) {
    throw new Error('Found node path was falsy.');
  }
  const nodePath = path.resolve(output);

  const replacement = `${nodePath} ${serviceImplPath}`;

  return contents.replace(/\{ExecStart\}/, replacement);
}

function main() {
  if (!fs.existsSync(templatePath)) {
    throw new Error(`templatePath "${templatePath}" does not exist.`);
  }

  if (!fs.existsSync(serviceImplPath)) {
    throw new Error(`serviceImplPath "${serviceImplPath}" does not exist.`);
  }

  // Generator service file contents
  let rawContents = fs.readFileSync(templatePath).toString();
  rawContents = rawContents.replace(/(?:\r\n|\r|\n)/g, '\n');

  const serviceContents = replaceExecStart(rawContents);

  // Write contents to location
  if (!fs.pathExistsSync(serviceDir)) {
    throw new Error(
      `Wanted to write service to "${serviceFilePath}", but "${serviceDir}" did not exist.`,
    );
  }

  console.log(`\nWriting file to "${serviceFilePath}":\n\n`);
  console.log(serviceContents);
  console.log(serviceContents);
  fs.writeFileSync(serviceFilePath, serviceContents);

  // Notify of changes
  const resultReload = spawnSync('systemctl', ['daemon-reload'], {stdio: 'inherit'});
  checkThrowSpawnSyncResult(resultReload);

  // Start service
  const resultStart = spawnSync('systemctl', ['start', serviceNameNoExt], {stdio: 'inherit'});
  checkThrowSpawnSyncResult(resultStart);
}

main();
