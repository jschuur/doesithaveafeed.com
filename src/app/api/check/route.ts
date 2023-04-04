import { boolean } from 'boolean';
import { NextResponse } from 'next/server';

import { detectFeeds } from '~/detectFeeds';
import { FeedUrl } from '~/types';

type ResponseData = { error: string } | { results: FeedUrl[] };

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

    return NextResponse.json({ results: feedUrls } satisfies ResponseData);
  } catch (e) {
    const error = e instanceof Error ? e.message : typeof e === 'string' && e ? e : 'Unknown error';

    return NextResponse.json({ error } satisfies ResponseData, { status: 500 });
  }
}
