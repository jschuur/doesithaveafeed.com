export const defaultLookupOptions = { scanAll: false, scanForFeeds: true };

export const nextFetchOptions: RequestInit = {
  ...{ cache: process.env.NODE_ENV === 'development' ? 'no-store' : undefined },
};
