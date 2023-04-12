import { uniqBy } from 'lodash';
import { parse } from 'node-html-parser';
import pluralize from 'pluralize';

import { feedCandidates } from './config';
import { FeedCheckParams, FeedUrl } from './types';
import { cleanupUrl, debug, validateUrl } from './util';

function autoDiscoveryCheck(siteUrl: string): Promise<FeedUrl[]> {
  console.log(`Checking ${siteUrl} for feeds (auto-discovery)...`);

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
              lookupStatus: 'completed',
              autoDiscovery: true,
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
      reject(`Error fetching URL ${siteUrl}: ${(error as Error).message}`);
    }
  });
}

async function feedUrlScan(params: FeedCheckParams): Promise<FeedUrl[]> {
  const { url, scanAll } = params;
  const feedUrls: FeedUrl[] = [];

  for (const candidate of feedCandidates) {
    const candidateUrl = `${url}${candidate}`;
    debug(`Checking candidate ${candidateUrl} ...`);

    if (await validateUrl(candidateUrl)) {
      console.log(`Found ${candidateUrl} via URL guess`);

      feedUrls.push({
        url: candidateUrl,
        validated: true,
        lookupStatus: 'completed',
        autoDiscovery: false,
      });
      if (!scanAll) break;
    }
  }

  console.log(`Found ${pluralize('feed link', feedUrls.length, true)} via URL guessing`);

  return feedUrls;
}

export async function detectFeeds(params: FeedCheckParams): Promise<FeedUrl[]> {
  const { url, scanForFeeds } = params;

  const cleanedUrl = cleanupUrl(url);
  let feedUrls = await autoDiscoveryCheck(cleanedUrl);

  if (scanForFeeds) feedUrls.push(...(await feedUrlScan(params)));

  return uniqBy(feedUrls, 'url');
}

export async function detectFeedsStream(params: FeedCheckParams): Promise<Response> {
  const { url, scanForFeeds, scanAll } = params;
  const encoder = new TextEncoder();

  const stream = new ReadableStream(
    {
      async start(controller) {
        const queue = async (data: string | object) => {
          debug(`Sending ${JSON.stringify(data)}`);

          const chunk = encoder.encode(JSON.stringify(data));
          controller.enqueue(chunk);
        };

        const autoDiscoveryFeeds = await autoDiscoveryCheck(url);

        // return auto-discovered feeds first
        for (const feed of autoDiscoveryFeeds) {
          queue({
            url: feed.url,
            lookupStatus: 'completed',
            validated: feed.validated,
          });
        }

        // find (more) feeds via URL guessing
        if (scanForFeeds)
          for (const candidate of feedCandidates) {
            const candidateUrl = `${url}${candidate}`;

            // skip previously auto-discovered feeds
            if (autoDiscoveryFeeds.find((feed) => feed.url === candidateUrl)) {
              console.log(`Skipping ${candidateUrl} (already auto-discovered)`);
              continue;
            }

            // queue({ url, lookupStatus: 'in_progress' } satisfies FeedUrl);

            // TODO exit on error
            const validated = await validateUrl(candidateUrl);
            console.log({
              url: candidateUrl,
              lookupStatus: 'completed',
              validated,
            });
            queue({
              url: candidateUrl,
              lookupStatus: 'completed',
              validated,
            } satisfies FeedUrl);

            if (validated && !scanAll) break;
          }

        controller.close();
      },
    },
    // force it to always send?
    { highWaterMark: 1 }
  );

  return new Response(stream);
}
