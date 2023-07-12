import {fork} from 'node:child_process';
import processManager from '../processManager';
import {prismaEnvVars} from '../prisma/prismaConstants';
// import {serverJsDir, rootVolumePath, channelVolumePath} from '../paths';
import pingWebsiteProcess from './pingWebsiteProcess';
import basicEventEmitter from '../util/basicEventEmitter';

console.log(prismaEnvVars);
console.log(fork);
console.log(processManager);
console.log(pingWebsiteProcess);

export const websiteReadyEmitter = basicEventEmitter<boolean>();

// function forkWebsiteProcess() {
//   if (process.env.NODE_ENV === 'development') {
//     // Server is run separately during development.
//     // ping website and wait until get response
//     pingWebsiteProcess()
//       .then(statusCode => {
//         console.log(`Website returned status code: ${statusCode}`);
//         websiteReadyEmitter.update(true);
//       })
//       .catch(e => {
//         console.log('Ping website failed.');
//         console.log(e);
//       });
//     return;
//   }

//   // Note: these environment variables are only provided during production. The
//   // development environment variables come from asdfdhsaifsho
//   const serverProcess = fork('server.js', [], {
//     cwd: serverJsDir,
//     env: {
//       ...process.env,
//       ...prismaEnvVars,
//       IS_ELECTRON: 'true',
//       TPR_ROOT_VOLUME_PATH: rootVolumePath,
//       TPR_CHANNEL_VOLUME_PATH: channelVolumePath,
//     },
//     // `silent` must be set to true for the stdio to be piped back to the parent
//     // process.
//     silent: true,
//   });
//   processManager.addChildProcess(serverProcess, 'next-server');

//   serverProcess.on('exit', () => {
//     websiteReadyEmitter.update(false);
//   });

//   if (serverProcess.stdout) {
//     serverProcess.stdout.on('data', (data: Buffer) => {
//       process.stdout.write(data);

//       const content = data.toString('utf8');
//       if (content.toLowerCase().indexOf('listening on port') >= 0) {
//         // ping website and wait until get response
//         pingWebsiteProcess()
//           .then(statusCode => {
//             console.log(`Website returned status code: ${statusCode}`);
//             websiteReadyEmitter.update(true);
//           })
//           .catch(e => {
//             console.log('Ping website failed.');
//             console.log(e);
//           });
//       }
//     });
//   }
// }

// export default forkWebsiteProcess;
