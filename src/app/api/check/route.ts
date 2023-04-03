import { boolean } from 'boolean';
import { NextResponse } from 'next/server';

import { detectFeeds } from '~/detectFeeds';
import { FeedUrl } from '~/types';

type ResponseData =
  | {
      error: string;
    }
  | {
      message: string;
      results: FeedUrl[];
    };

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url: string = searchParams.get('url') || '';
  const scanForFeeds = boolean(searchParams.get('scanForFeeds'));
  const scanAll = boolean(searchParams.get('scanAll'));

  if (!url)
    return NextResponse.json({ error: 'No URL provided' } satisfies ResponseData, { status: 400 });

  console.log(`Checking ${url} for feeds...`);

  try {
    const feedUrls = await detectFeeds(url, { scanForFeeds, scanAll });
    const validFeedUrlsCount = feedUrls.filter((f) => f.validated)?.length || 0;

    if (feedUrls.length)
      return NextResponse.json({
        message: validFeedUrlsCount ? 'Feeds found' : 'Feeds found, but none valid',
        results: feedUrls,
      } satisfies ResponseData);
    else
      return NextResponse.json({ error: `No feeds found for ${url}` } satisfies ResponseData, {
        status: 404,
      });
  } catch (e) {
    const error = e instanceof Error ? e.message : typeof e === 'string' && e ? e : 'Unknown error';

    return NextResponse.json({ error } satisfies ResponseData, { status: 500 });
  }
}
