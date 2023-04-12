// these are in some kind of order of likelihood, to prevent request spamming and increasing the API response time
export const feedCandidates = [
  'rss.xml',
  'rss',
  'feed',
  // recommended by ChatGPT, but unsure if worth it
  // 'rss/all',
  // 'rss/latest',
  // 'rss/posts',
  // 'rss/news',
  // 'feed/latest',
  // 'feed/posts',
  'feed.xml',
  'feed.rss',
  'blog/rss.xml',
  'blog/feed.xml',
  'blog/feed.rss',
  'blog/rss',
  'blog/feed',
  'atom.xml',
  'feed.atom',
  'posts/rss.xml',
  'posts/feed.xml',
  'posts/feed.rss',
  'articles/rss.xml',
  'articles/feed.xml',
  'articles/feed.rss',
  // check atom subdirectory variations last
  'atom',
  'blog/atom.xml',
  'posts/atom.xml',
  'articles/atom.xml',
  'blog/feed.atom',
  'posts/feed.atom',
  'articles/feed.atom',
  // 'posts/feed/',
  // 'blog/feed/',
  // 'blog/rss/',
  // 'articles/feed/',
  // 'articles/rss/',
];

export const defaultLookupOptions = { scanAll: false, scanForFeeds: true };

export const nextFetchOptions: RequestInit = {
  ...{ cache: process.env.NODE_ENV === 'development' ? 'no-store' : undefined },
};
