export type ChannelInfo = {
  name: string;
  owner: string;
  repo: string;
  // site should be either an empty string or a URL
  site: string;
  channel: string;
  // `latestVersion` can be missing since we have to fetch it for each
  // individual channel and we don't want to fail the entire thing if we fail to
  // get the version for a single channel.
  latestVersion?: string;
};
