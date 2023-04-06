export type FeedUrl = {
  url: string;
  autodiscovery: boolean;
  validated: boolean;
};

export type LookupOptions = {
  scanForFeeds: boolean;
  scanAll: boolean;
};
