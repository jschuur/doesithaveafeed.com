'use client';
import { ReactNode, useContext } from 'react';

import { LookupContext } from '~/store';

export default function FeedList() {
  const { feedUrls, error, isChecking } = useContext(LookupContext);

  if (feedUrls === null || isChecking) return null;

  const validatedFeedUrls = feedUrls.filter((feedUrl) => feedUrl.validated);

  const render = (node: ReactNode) => <div className='py-4'>{node}</div>;

  // TODO: explicitly say no validated feeds found
  if (error) return render(<div>{error}</div>);

  return render(
    <>
      <h2>Feeds found:</h2>
      {validatedFeedUrls.length ? (
        <ul className='py-2'>
          {validatedFeedUrls.map(({ url, autodiscovery }) => (
            <li key={url} className='list-disc ml-8'>
              <a href={url}>{url}</a> {autodiscovery && '(auto-discovery)'}
            </li>
          ))}
        </ul>
      ) : (
        <p className='italic py-2'>None</p>
      )}
    </>
  );
}
