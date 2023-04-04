import { boolean } from 'boolean';
import { ApiHandler } from 'sst/node/api';

import { detectFeeds } from '~/detectFeeds';
import { FeedUrl } from '~/types';

type ResponseData = { error: string } | { results: FeedUrl[] };

// non Vercel hosted API route can run for longer without timing out on the free Vercel tier after 10 seconds
export const handler = ApiHandler(async ({ queryStringParameters: params }) => {
  const url: string = params.url || '';
  const scanForFeeds = boolean(params.scanForFeeds);
  const scanAll = boolean(params.scanAll);

  const response = (data: object, statusCode = 200) => ({
    statusCode,
    body: JSON.stringify(data),
  });

  if (!url) return response({ error: 'No URL provided' } satisfies ResponseData, 400);

  console.log(`Checking ${url} for feeds...`);

  try {
    const feedUrls = await detectFeeds(url, { scanForFeeds, scanAll });

    return response({ results: feedUrls } satisfies ResponseData);
  } catch (e) {
    const error = e instanceof Error ? e.message : typeof e === 'string' && e ? e : 'Unknown error';

    return response({ error } satisfies ResponseData, 500);
  }
});
