import {Service} from 'node-windows';
import {windowsServiceName, serviceScriptPath} from './windowsServiceConstants.mjs';

// Note: you can read logs in the Windows Event Viewer.

// NOTE: it is critical that the globally installed yarn is available in the
// PATH environment variable. On Windows, it is possible to provide login info
// to the service if it is only available in the User's PATH, but it is
// recommended that you make it available in the system's PATH so you do not
// have to provide a password. If needed, we can theoretically pass the info as
// an arg to the installer script, but only if we really need to. On Windows,
// the path you need to copy from your User's PATH might look like
// `C:\Users\<user>\AppData\Roaming\npm` which will should have global
// installation of yarn in it (yarn should have been installed globally by npm).

const svc = new Service({
  name: windowsServiceName,
  description: 'Polls to see if the TPR generator website should update, and updates it if needed.',
  script: serviceScriptPath,
  env: [
    {
      name: 'TPR_IS_SERVICE',
      value: 'true',
    },
  ],
});

svc.on('install', svc.start);

svc.install();

console.log(svc);
