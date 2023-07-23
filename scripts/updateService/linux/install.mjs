import path from 'node:path';
import {fileURLToPath} from 'node:url';
import fs from 'fs-extra';
import {spawnSync} from 'node:child_process';
import {linuxServiceFilename} from './constants.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serviceDir = '/lib/systemd/system';
const serviceFilePath = path.join(serviceDir, linuxServiceFilename);

const templatePath = path.join(__dirname, 'serviceTemplate.txt');
const serviceImplPath = path.resolve(path.join(__dirname, '../serviceImpl.mjs'));

function replaceExecStart(contents) {
  const result = spawnSync('which', ['node']);
  const error = result.stderr.toString();
  if (error) {
    throw new Error(error);
  } else if (result.status !== 0) {
    throw new Error(`result.status was non-zero ${result.status}.`);
  }
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
  console.log(serviceContents);

  // Write contents to location
  if (!fs.pathExistsSync(serviceDir)) {
    throw new Error(
      `Wanted to write service to "${serviceFilePath}", but "${serviceDir}" did not exist.`,
    );
  }
  fs.writeFileSync(serviceFilePath, serviceContents);

  // Notify systemctl of daemon change stuff

  // start service
}

main();
