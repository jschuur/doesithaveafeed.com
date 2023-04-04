'use client';
import { ReactNode } from 'react';

import { FeedUrl } from '~/types';

type Props = {
  feedUrls: FeedUrl[];
  error: string;
  isChecking: boolean;
  siteUrl: string;
};

export default function FeedList({ feedUrls, error, isChecking, siteUrl }: Props) {
  const validatedFeedUrls = feedUrls.filter((feedUrl) => feedUrl.validated);

  const render = (node: ReactNode) => <div className='py-4 md:py-6'>{node}</div>;

  // TODO: explicitly say no validated feeds found
  if (error) return render(<div>{error}</div>);

  if (validatedFeedUrls.length)
    return render(
      <>
        <h2>Feeds for {siteUrl}:</h2>
        <ul className='py-2'>
          {validatedFeedUrls.map(({ url, autodiscovery }) => (
            <li key={url} className='list-disc ml-8'>
              <a href={url}>{url}</a> {autodiscovery && '(auto-discovery)'}
            </li>
          ))}
        </ul>
      </>
    );

  return !isChecking ? render(<div>No feeds found for {siteUrl}</div>) : null;
}
