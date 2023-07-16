import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {Service} from 'node-windows';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const scriptPath = path.resolve(path.join(__dirname, './serviceImpl.mjs'));

const svc = new Service({
  name: 'my test service',
  description: 'desc of test service',
  script: scriptPath,
  env: [
    {
      name: 'TPR_ARGS',
      value: 'this is the args',
    },
  ],
});

svc.on('install', svc.start);

svc.install();

console.log(svc);
