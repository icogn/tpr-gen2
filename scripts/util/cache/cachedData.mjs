import fs from 'fs-extra';
import path from 'node:path';

const cacheDurationMs = 5 * 60 * 1000;

export function tryGetCachedData(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const jsonObj = fs.readJsonSync(filePath);
  if (!jsonObj.timestamp) {
    return null;
  }

  if (Date.now() - jsonObj.timestamp > cacheDurationMs) {
    return null;
  }

  return jsonObj.data;
}

export function cacheData(filePath, data) {
  fs.ensureDirSync(path.dirname(filePath));

  const cacheObj = {
    timestamp: Date.now(),
    data,
  };

  fs.writeJSONSync(filePath, cacheObj);
}
