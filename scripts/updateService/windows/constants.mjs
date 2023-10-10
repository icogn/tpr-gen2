import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const serviceScriptPath = path.resolve(path.join(__dirname, '../serviceImpl.mjs'));

export const windowsServiceName = 'tpr-generator-updater-service';
