type RawBranchInfo = {
  name: string;
  owner: string;
  repo: string;
  site: URL;
};

export interface BranchInfo extends RawBranchInfo {
  channel: string;
}

const REQUEST_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

let cachedData: BranchInfo[] = [];
let lastRequestTime = -1;

function withinCacheTime() {
  return Date.now() - lastRequestTime < REQUEST_CACHE_DURATION;
}

export async function fetchBranchesConfig() {
  if (cachedData.length > 0 && withinCacheTime()) {
    return cachedData;
  }

  try {
    const res = await fetch(
      'https://raw.githubusercontent.com/icogn/tpr-gen2/main/staticApi/branches.json',
    );
    const responseText = await res.text();
    const config = JSON.parse(responseText);

    if (config && typeof config === 'object') {
      const branchInfoArr: BranchInfo[] = [];

      Object.keys(config).forEach(channel => {
        const channelConfig = config[channel] as RawBranchInfo;
        branchInfoArr.push({
          ...channelConfig,
          channel: channel === 'stable' ? '' : channel,
        });
      });

      cachedData = branchInfoArr;
      lastRequestTime = Date.now();

      // TODO: need to fetch version data for each branch.
    }
  } catch (e) {
    console.log('Failed to fetch branches config.');
    console.log(e);
  }

  return cachedData;
}
