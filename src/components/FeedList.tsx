'use client';

import { FeedUrl } from '~/types';

type Props = {
  feedUrls: FeedUrl[];
  isChecking: boolean;
  error: string;
  siteUrl: string;
};

export default function FeedList({ feedUrls, isChecking, error, siteUrl }: Props) {
  const validatedFeedUrls = feedUrls.filter((feedUrl) => feedUrl.validated);

  // TODO: explicitly say no validated feeds found
  return (
    <div className='py-8'>
      {isChecking && <div className='center'>Checking...</div>}
      {error && <div>{error}</div>}
      {validatedFeedUrls?.length ? (
        <>
          <h2 className='text-xl'>Feeds for {siteUrl}:</h2>
          <ul className='py-2'>
            {validatedFeedUrls.map(({ url, autodiscovery }) => (
              <li key={url}>
                <a href={url}>{url}</a> {autodiscovery && '(auto-discovery)'}
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}
