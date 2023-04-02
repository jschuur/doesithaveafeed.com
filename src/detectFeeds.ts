import { parse } from 'node-html-parser';
import pluralize from 'pluralize';

import { feedCandidates } from './settings';
import { cleanupUrl, validateUrl } from './util';

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
        const feedUrls: FeedUrl[] = [];

        for (const el of autoDiscoveredUrls) {
          const href = el.getAttribute('href') || '';

          if (href) {
            const url = new URL(href, siteUrl).toString();
            const validated = await validateUrl(url);

            feedUrls.push({
              url,
              validated,
              autodiscovery: true,
            });
          }
        }

        console.log(
          `Found ${pluralize('feed link', feedUrls.length, true)} via auto discovery: ${feedUrls
            .map(({ url }) => url)
            .join(', ')}`
        );

        resolve(feedUrls);
      } else {
        console.log(`...no auto-discovery links found at ${siteUrl}`);

        resolve([]);
      }
    } catch (error) {
      reject(`Error fetching URL ${siteUrl}`);
    }
  });
}

async function feedUrlScan(url: string, scanAll: boolean): Promise<FeedUrl[]> {
  const feedUrls: FeedUrl[] = [];

  for (const path of feedCandidates) {
    const feedUrl = `${url}${path}`;
    console.log(`Checking ${feedUrl} ...`);

    if (await validateUrl(feedUrl)) {
      console.log(`Found ${feedUrl} via URL guess`);

      feedUrls.push({ url: feedUrl, validated: true, autodiscovery: false });
      if (!scanAll) break;
    }
  }

  console.log(`Found ${pluralize('feed link', feedUrls.length, true)} via URL guessing`);

  return feedUrls;
}

export async function detectFeeds(baseUrl: string, scanAll: boolean): Promise<FeedUrl[]> {
  if (!baseUrl) throw new Error('No URL provided');

  const url = cleanupUrl(baseUrl);
  const feedUrls = await autoDiscoveryCheck(url);

  // TODO: option to keep checking after auto-discovery
  return feedUrls.length ? feedUrls : feedUrlScan(url, scanAll);
}
