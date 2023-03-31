import { parse } from 'node-html-parser';
import { makeAbsoluteUrl } from './util';

const folders = ['/', '/blog', '/posts', '/articles'];
const files = ['feed.xml', 'rss.xml', 'atom.xml', 'feed.rss', 'feed.atom'];

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

        console.log(`Found ${resolvedFeedUrls.length} feed links: ${resolvedFeedUrls.join(', ')}`);

        resolve(resolvedFeedUrls);
      }
      console.log(`...no auto-discovery links found at ${url}`);

      resolve([]);
    } catch (error) {
      reject('Error fetching URL');
    }
  });
}

function feedUrlChecks(url: string) {}

export async function detectFeeds(url: string) {
  if (!url) return [];

  // TODO: Check common feed URLs
  const checks = [autoDiscoveryCheck(url)];

  return Promise.race(checks);
}
