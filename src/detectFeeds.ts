import { parse } from 'node-html-parser';

import { feedCandidates } from './settings';
import { makeAbsoluteUrl, validateUrl } from './util';

import { FeedUrl } from './types';

function autoDiscoveryCheck(siteUrl: string): Promise<FeedUrl[]> {
  console.log(`Auto-discovery check at ${siteUrl}...`);

  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(siteUrl);
      const text = await response.text();
      const doc = parse(text);

      const autoDiscoveredUrls = doc.querySelectorAll('link[type="application/rss+xml"]');

      if (autoDiscoveredUrls.length > 0) {
        const feedLinks: FeedUrl[] = [];

        for (const el of autoDiscoveredUrls) {
          const url = el.getAttribute('href') || '';
          if (url) {
            const validated = await validateUrl(makeAbsoluteUrl(siteUrl, url));

            feedLinks.push({
              url: makeAbsoluteUrl(siteUrl, url),
              validated,
              autodiscovery: true,
            });
          }
        }

        console.log(
          `Found ${feedLinks.length} feed links via auto discovery: ${feedLinks
            .map(({ url }) => url)
            .join(', ')}`
        );

        resolve(feedLinks);
      }
      console.log(`...no auto-discovery links found at ${siteUrl}`);

      resolve([]);
    } catch (error) {
      reject('Error fetching URL');
    }
  });
}

async function feedUrlScan(url: string, scanAll: boolean): Promise<FeedUrl[]> {
  const feedUrls: FeedUrl[] = [];

  if (url.endsWith('/')) url = url.slice(0, -1);

  for (const path of feedCandidates) {
    const feedUrl = `${url}${path}`;
    console.log(`Checking ${feedUrl} ...`);

    if (await validateUrl(feedUrl)) {
      console.log(`Found ${feedUrl} via URL guess`);

      feedUrls.push({ url: feedUrl, validated: true, autodiscovery: false });
      if (!scanAll) break;
    }
  }

  return feedUrls;
}

export async function detectFeeds(baseUrl: string, scanAll: boolean): Promise<FeedUrl[]> {
  if (!baseUrl) throw new Error('No URL provided');

  const feedUrls = await autoDiscoveryCheck(baseUrl);

  // TODO: option to keep checking after auto-discovery
  return feedUrls.length ? feedUrls : feedUrlScan(baseUrl, scanAll);
}
