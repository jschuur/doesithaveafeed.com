import { parse } from 'node-html-parser';

import { feedCandidates } from './settings';
import { makeAbsoluteUrl, validateUrls } from './util';

type FeedCheckResult = {
  urls: {
    detectedFeeds: string[];
    validatedFeeds: string[];
  };
  autodiscovery: boolean;
};

function autoDiscoveryCheck(url: string): Promise<string[]> {
  console.log(`Auto-discovery check at ${url}...`);

  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(url);
      const text = await response.text();
      const doc = parse(text);

      const feedLinks = Array.from(doc.querySelectorAll('link[type="application/rss+xml"]'));

      if (feedLinks.length > 0) {
        const resolvedFeedUrls = feedLinks.map((fl) =>
          makeAbsoluteUrl({ base: url, url: fl.getAttribute('href') || '' })
        );

        console.log(
          `Found ${resolvedFeedUrls.length} feed links via auto discovery: ${resolvedFeedUrls.join(
            ', '
          )}`
        );

        resolve(resolvedFeedUrls);
      }
      console.log(`...no auto-discovery links found at ${url}`);

      resolve([]);
    } catch (error) {
      reject('Error fetching URL');
    }
  });
}

async function feedUrlScan(url: string, scanAll: boolean): Promise<FeedCheckResult> {
  const feedUrls = [];

  if (url.endsWith('/')) url = url.slice(0, -1);

  for (const path of feedCandidates) {
    const feedUrl = `${url}${path}`;
    console.log(`Checking ${feedUrl} ...`);

    if ((await validateUrls([feedUrl])).length) {
      console.log(`Found ${feedUrl} via URL guess`);

      feedUrls.push(feedUrl);
      if (!scanAll) break;
    }
  }

  return {
    urls: {
      detectedFeeds: feedUrls,
      validatedFeeds: feedUrls,
    },
    autodiscovery: false,
  };
}

export async function detectFeeds(baseUrl: string, scanAll: boolean): Promise<FeedCheckResult> {
  if (!baseUrl) throw new Error('No URL provided');

  const feedUrls = await autoDiscoveryCheck(baseUrl);

  return feedUrls.length
    ? {
        urls: {
          detectedFeeds: feedUrls,
          validatedFeeds: await validateUrls(feedUrls),
        },
        autodiscovery: true,
      }
    : feedUrlScan(baseUrl, scanAll);
}
