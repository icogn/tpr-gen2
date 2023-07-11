#!/usr/bin/env node

process.env.MODE = 'production';
process.env.NODE_ENV = 'production';

import {execa} from 'execa';
import path from 'node:path';
import fs, {readFileSync, writeFileSync} from 'node:fs';
import searchUpFileTree from './util/searchUpFileTree.mjs';
import {fileURLToPath} from 'node:url';
// import {execSync} from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const rootDir = searchUpFileTree(__dirname, currPath =>
  fs.existsSync(path.join(currPath, 'package.json')),
);
if (!rootDir) {
  throw new Error('Failed to find rootDir');
}
const websiteDir = path.join(rootDir, 'website');

async function buildNext() {
  const execaOptions = {
    // cwd: process.cwd(),
    // cwd: path.join(process.cwd(), 'website'),
    cwd: websiteDir,
    stdio: 'inherit',
    preferLocal: true,
  };

  // '.' dir is referring to 'website' dir based on execaOptions cwd
  await execa('next', ['build', '.'], execaOptions);
}

// Then run yarn command build.

// Then run: electron-builder build --config .electron-builder.config.js --dir --config.asar=false

function getGitCommitEnvStr() {
  // const gitCommitHash = execSync('git rev-parse HEAD', {
  //   cwd: websiteDir,
  //   encoding: 'utf8',
  // });

  // if (!gitCommitHash) {
  //   throw new Error('Failed to determine git commit hash.');
  // }

  // return `GIT_COMMIT=${gitCommitHash.substring(0, 12)}`;

  // TODO: the git environment is not available inside Docker when building the
  // image. This needs to be handled in a script which puts this in the ENV then
  // runs the docker build stuff. This is what is done in the current
  // randomizer-web-generator.
  return 'placeholder';
}

// eslint-disable-next-line
function updateWebsiteEnv() {
  // const websiteEnvFilePath = path.join(websiteDir, 'website/.next/standalone/website/.env');
  const websiteEnvFilePath = path.join(websiteDir, '.next/standalone/website/.env');
  // const websiteEnvFilePath = path.join(websiteDir, '.next/standalone/.env');
  const websiteEnvStr = readFileSync(websiteEnvFilePath, 'utf8');

  // const envDirEnvFilePath = path.join(websiteDir, 'env/.env');
  const envDirEnvFilePath = path.join(websiteDir, '../env/.env');
  const envDirEnvStr = readFileSync(envDirEnvFilePath, 'utf8');

  const newEnv = [websiteEnvStr, envDirEnvStr, getGitCommitEnvStr()].join('\n\n');
  writeFileSync(websiteEnvFilePath, newEnv, 'utf8');
}

// Next wants us to ideally use a CDN for this, but says to copy these in
// manually if not using a CDN. Will be 404s if we don't copy it in.
function copyPublicAndStaticFolders() {
  const publicSrcPath = path.join(websiteDir, 'public');
  const publicDestPath = path.join(websiteDir, '.next/standalone/website/public');
  fs.cpSync(publicSrcPath, publicDestPath, {recursive: true});

  const staticSrcPath = path.join(websiteDir, '.next/static');
  const staticDestPath = path.join(websiteDir, '.next/standalone/website/.next/static');
  fs.cpSync(staticSrcPath, staticDestPath, {recursive: true});
}

async function runBuild() {
  // First run Next build.
  console.log('BUILDING NEXT...');
  await buildNext();
  console.log('AFTER BUILD NEXT');

  // Minify
  // if (shouldShrink) {
  //   console.log('BEFORE SHRINK STANDALONE OUTPUT');
  //   // do shrink-next-standalone.mjs here
  //   console.log('AFTER SHRINK STANDALONE OUTPUT');
  // }

  // Manually edit the .env file which gets generated?
  updateWebsiteEnv();

  copyPublicAndStaticFolders();
}

runBuild();
