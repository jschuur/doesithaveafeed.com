import { boolean } from 'boolean';
import { NextResponse } from 'next/server';

import { detectFeeds, detectFeedsStream } from '~/detectFeeds';
import { FeedCheckParamsSchema, FeedUrl } from '~/types';
import { debug } from '~/util';

export const config = {
  runtime: 'edge',
};

type ResponseData = { error: string } | { results: FeedUrl[] };

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const params = FeedCheckParamsSchema.parse({
    url: searchParams.get('url'),
    scanForFeeds: boolean(searchParams.get('scanForFeeds')),
    scanAll: boolean(searchParams.get('scanAll')),
  });
  const { url } = params;

  if (!url)
    return NextResponse.json({ error: 'No URL provided' } satisfies ResponseData, { status: 400 });

  console.log(`Checking ${url} for feeds (GET)...`);

  try {
    const feedUrls = await detectFeeds(params);

    return NextResponse.json({ results: feedUrls } satisfies ResponseData);
  } catch (e) {
    const error = e instanceof Error ? e.message : typeof e === 'string' && e ? e : 'Unknown error';

    return NextResponse.json({ error } satisfies ResponseData, { status: 500 });
  }
}

export async function POST(req: Request) {
  const params = FeedCheckParamsSchema.parse(await req.json());

  console.log(`Checking ${params.url} for feeds (streaming)...`);

  return detectFeedsStream(params);
}
