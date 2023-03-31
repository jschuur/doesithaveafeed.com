import { boolean } from 'boolean';
import { NextResponse } from 'next/server.js';

import { detectFeeds } from '~/detectFeeds';

type ResponseData =
  | {
      error: string;
    }
  | {
      message: string;
      autodiscovery: boolean;
      results: {
        detectedFeeds: string[];
        validatedFeeds: string[];
      };
    };

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url: string = searchParams.get('url') || '';
  const scanAll: string = searchParams.get('scanAll') || '';

  if (!url)
    return NextResponse.json({ error: 'No URL provided' } satisfies ResponseData, { status: 400 });

  console.log(`Checking ${url} for feeds...`);

  try {
    const { urls, autodiscovery } = await detectFeeds(url, boolean(scanAll));

    if (urls.detectedFeeds.length)
      return NextResponse.json({
        message: urls.validatedFeeds.length ? 'Feeds found' : 'Feeds found, but none valid',
        results: urls,
        autodiscovery,
      } satisfies ResponseData);
    else
      return NextResponse.json({ error: 'No feeds found' } satisfies ResponseData, { status: 404 });
  } catch (e) {
    const error = e instanceof Error ? e.message : typeof e === 'string' && e ? e : 'Unknown error';

    return NextResponse.json({ error } satisfies ResponseData, { status: 500 });
  }
}
