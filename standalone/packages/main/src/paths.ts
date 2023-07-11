import path from 'node:path';
import {app} from 'electron';
import {channelKey} from './channel';

const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.IS_TEST === 'true';

export const nodeModulesDir =
  isProduction && !isTest
    ? path.resolve(path.join(app.getAppPath(), '../node_modules'))
    : path.resolve('./node_modules');

let rootVolumeDirectory;
if (isTest) {
  rootVolumeDirectory = path.resolve('./volume-test');
} else if (isProduction) {
  rootVolumeDirectory = path.resolve(path.join(app.getPath('userData'), 'volume'));
} else {
  rootVolumeDirectory = path.resolve('./volume');
}

export const rootVolumePath = rootVolumeDirectory;
export const channelVolumePath = path.join(rootVolumeDirectory, channelKey);
console.log(`rootVolumePath:${rootVolumePath}`);
console.log(`channelVolumePath:${channelVolumePath}`);

export const prismaSchemaPath =
  isProduction && !isTest
    ? path.join(app.getAppPath(), '../prisma/schema.prisma')
    : path.resolve('./website/prisma/schema.prisma');

const appPathDirName = path.dirname(app.getAppPath());

export const serverJsDir =
  isProduction && !isTest
    ? path.join(appPathDirName, 'standalone-website/website')
    : path.resolve('./website/.next/standalone/website');

console.log(`serverJsDir:${serverJsDir}`);
