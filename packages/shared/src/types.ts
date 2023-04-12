export type FeedUrl = {
  url: string;
  autoDiscovery: boolean;
  validated: boolean;
};

export type LookupOptions = {
  scanForFeeds: boolean;
  scanAll: boolean;
};
