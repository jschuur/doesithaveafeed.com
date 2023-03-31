// import type { NextApiRequest, NextApiResponse } from 'next';

import { NextResponse } from 'next/server.js';
import { detectFeeds } from '~/detectFeeds';
import { validateUrls } from '~/util';

type Data = {
  error?: string;
  message?: string;
  results?: {
    detectFeeds?: string[];
    validatedFeeds?: string[];
  };
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url: string = searchParams.get('url') || '';

  if (!url) return NextResponse.json({ error: 'No URL provided' }, { status: 400 });

  console.log(`Checking ${url} for feeds...`);

  try {
    const detectedFeeds = await detectFeeds(url as string);

    if (detectedFeeds?.length) {
      const validatedFeeds = await validateUrls(detectedFeeds);

      return NextResponse.json({
        message: validatedFeeds?.length ? 'Feeds found' : 'Feeds found, but none valid',
        results: { detectedFeeds, validatedFeeds },
      });
    } else return NextResponse.json({ error: 'No feeds found' }, { status: 404 });
  } catch (e) {
    const error = e instanceof Error ? e.message : typeof e === 'string' && e ? e : 'Unknown error';

    return NextResponse.json({ error }, { status: 500 });
  }
}
