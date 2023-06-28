const channelProps = {
  name: 'string',
  owner: 'string',
  repo: 'string',
  // `site` should be either an empty string or a URL
  site: 'siteProp',
  channel: 'string',
  latestVersion: '?string',
};

function isObjectChannelInfo(data: unknown): boolean {
  if (typeof data !== 'object' || !data) {
    return false;
  }
  const obj = data as {[key: string]: unknown};

  const propKeys = Object.keys(channelProps) as (keyof typeof channelProps)[];
  for (let i = 0; i < propKeys.length; i++) {
    const propKey = propKeys[i];
    const rawVal = channelProps[propKey];
    const optional = rawVal[0] === '?';

    if (!optional && !(propKey in obj)) {
      // non-optional property is missing
      return false;
    }

    const valOnObj = obj[propKey];
    if (optional && valOnObj === undefined) {
      continue;
    }

    const desiredType = optional ? rawVal.substring(1) : rawVal;
    switch (desiredType) {
      case 'string': {
        if (typeof valOnObj !== 'string') {
          console.log('not string');
          return false;
        }
        break;
      }
      case 'siteProp': {
        try {
          if (typeof valOnObj === 'string') {
            if (valOnObj.length > 0) {
              new URL(valOnObj);
            }
          } else {
            return false;
          }
        } catch (e) {
          return false;
        }
        break;
      }
      default:
        throw new Error(`Cannot check if property "${propKey}" is "${desiredType}".`);
    }
  }

  return true;
}

export default isObjectChannelInfo;
