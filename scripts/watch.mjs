#!/usr/bin/env node

process.env.NODE_ENV = 'development';

import {build, createServer} from 'vite';
import electronPath from 'electron';
import {spawn} from 'child_process';
import {execa} from 'execa';
import path from 'path';
// import getRootDir from './util/getRootDir.mjs';
// import getGitCommitHash from './util/getGitCommitHash.mjs';
// import getChannelString from './util/getChannelString.mjs';
import {prepareWebsiteEnv} from './util/prepareEnv.mjs';
import {getVersion} from './util/getVersion.mjs';

// const rootDir = getRootDir();
// process.chdir(path.join(rootDir, 'standalone'));

/** @type 'production' | 'development'' */
const mode = (process.env.MODE = process.env.MODE || 'development');

/** @type {import('vite').LogLevel} */
const logLevel = 'warn';

/**
 * Setup watcher for `main` package
 * On file changed it totally re-launch electron app.
 * @param {import('vite').ViteDevServer} watchServer Renderer watch server instance.
 * Needs to set up `VITE_DEV_SERVER_URL` environment variable from {@link import('vite').ViteDevServer.resolvedUrls}
 */
function setupMainPackageWatcher({resolvedUrls}) {
  process.env.VITE_DEV_SERVER_URL = resolvedUrls.local[0];
  // process.env.VITE_DEV_SERVER_URL = 'http://localhost:3000';

  /** @type {ChildProcess | null} */
  let electronApp = null;

  return build({
    mode,
    logLevel,
    configFile: 'standalone/packages/main/vite.config.js',
    build: {
      /**
       * Set to {} to enable rollup watcher
       * @see https://vitejs.dev/config/build-options.html#build-watch
       */
      watch: {},
    },
    plugins: [
      {
        name: 'reload-app-on-main-package-change',
        // Note: removed code related to killing this watch process when you
        // manually close the electron window since that causes massive problems
        // on Windows since the processes are not killed gracefully.
        writeBundle() {
          // Kill electron if process already exists
          if (electronApp != null) {
            // Note that this is not a graceful exit (on Windows at least). As
            // such, changes to cookies aren't saved like they are when you
            // close the app by clicking the X. Possible they are never saved
            // when the app is closed by a signal regardless of OS.
            electronApp.kill('SIGINT');
            electronApp = null;
          }

          // Spawn new electron process
          electronApp = spawn(String(electronPath), ['--inspect', 'standalone'], {
            stdio: 'inherit',
            // Technically only care about some of these env vars like
            // TPR_GIT_COMMIT, but the others are included as well. They aren't
            // used so it shouldn't really matter.
            env: getNextServerDevelopmentEnv(),
          });
        },
      },
    ],
  });
}

/**
 * Setup watcher for `preload` package
 * On file changed it reload web page.
 * @param {import('vite').ViteDevServer} watchServer Renderer watch server instance.
 * Required to access the web socket of the page. By sending the `full-reload` command to the socket, it reloads the web page.
 */
function setupPreloadPackageWatcher({ws}) {
  return build({
    mode,
    logLevel,
    configFile: 'standalone/packages/preload/vite.config.js',
    build: {
      /**
       * Set to {} to enable rollup watcher
       * @see https://vitejs.dev/config/build-options.html#build-watch
       */
      watch: {},
    },
    plugins: [
      {
        name: 'reload-page-on-preload-package-change',
        writeBundle() {
          ws.send({
            type: 'full-reload',
          });
        },
      },
    ],
  });
}

// /**
//  * Setup watcher for `preload` package
//  * On file changed it reload web page.
//  * @param {import('vite').ViteDevServer} watchServer Renderer watch server instance.
//  * Required to access the web socket of the page. By sending the `full-reload` command to the socket, it reloads the web page.
//  */
// function setupPreloadPackageWatcher() {
//   return build({
//     mode,
//     logLevel,
//     configFile: 'packages/preload/vite.config.js',
//     build: {
//       /**
//        * Set to {} to enable rollup watcher
//        * @see https://vitejs.dev/config/build-options.html#build-watch
//        */
//       watch: {},
//     },
//     // Disabled plugin which reloads the webpage when editing the preload
//     // script. This would be pretty involved to get working, and it is not worth
//     // it since you probably will never update the preload script (and if you do
//     // you can just reload the page manually).
//   });
// }

// function computeChannelString() {
//   const packageJsonPath = path.join(rootDir, 'package.json');
//   const packageJson = JSON.parse(fs.readFileSync(packageJsonPath));
//   const appVersion = packageJson.version;

//   if (semver.parse(appVersion) == null) {
//     throw new Error(`Critical error: semver failed to parse app version "${appVersion}".`);
//   }
//   const prereleaseVal = semver.prerelease(appVersion);
//   if (prereleaseVal == null) {
//     return 'stable';
//   }
//   const channel = prereleaseVal[0];
//   if (!channel) {
//     throw new Error(`Failed to parse channel from appVersion "${appVersion}".`);
//   }
//   return channel;
// }

function getNextServerDevelopmentEnv() {
  // Root volume path is always the same when starting the development next
  // server from this file.

  return {
    ...process.env,
    ...prepareWebsiteEnv({
      imageVersion: getVersion(),
    }),
  };
}

function startNextServer() {
  const execaOptions = {
    // cwd: process.cwd(),
    cwd: path.join(process.cwd(), 'website'),
    stdio: 'inherit',
    preferLocal: true,
    env: getNextServerDevelopmentEnv(),
  };

  // '.' dir is referring to 'website' dir based on execaOptions cwd
  return execa('next', ['.'], execaOptions);
}

async function dev() {
  startNextServer();

  /**
   * Dev server for Renderer package
   * This must be the first,
   * because the {@link setupMainPackageWatcher} and {@link setupPreloadPackageWatcher}
   * depend on the dev server properties
   */
  const rendererWatchServer = await createServer({
    mode,
    logLevel,
    configFile: 'standalone/packages/renderer/vite.config.ts',
  }).then(s => {
    // console.log('\n\ns is:');
    // console.log(s);
    return s.listen();
  });

  console.log('rendererWatchServer.resolvedUrls');
  console.log(rendererWatchServer.resolvedUrls);

  await setupPreloadPackageWatcher(rendererWatchServer);
  await setupMainPackageWatcher(rendererWatchServer);
}

dev();
