import {app} from 'electron';
import path from 'node:path';
import dotenv from 'dotenv';

// `import.meta.env` provided by Vite. Set to `process.env.NODE_ENV` since that
// is what we would rather check against and we expect it to be there.
process.env.NODE_ENV = import.meta.env.MODE;
console.log(`process.env.NODE_ENV:${process.env.NODE_ENV}`);

if (process.env.NODE_ENV === 'production') {
  const resourcesDir = path.dirname(app.getAppPath());
  const envFile = path.join(resourcesDir, 'myenv.env');

  dotenv.config({path: envFile});
}
