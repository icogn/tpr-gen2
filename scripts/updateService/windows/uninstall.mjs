import { Service } from 'node-windows';
import { windowsServiceName, serviceScriptPath } from './constants.mjs';

const svc = new Service({
  name: windowsServiceName,
  script: serviceScriptPath,
});

svc.uninstall();
