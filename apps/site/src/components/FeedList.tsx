'use client';
import { ReactNode } from 'react';
import { FeedUrl } from '@doesithaveafeed/shared';

type Props = {
  feedUrls: FeedUrl[];
  error: string;
  isChecking: boolean;
  siteUrl: string;
};

export default function FeedList({ feedUrls, error, isChecking, siteUrl }: Props) {
  const validatedFeedUrls = feedUrls.filter((feedUrl) => feedUrl.validated);

  if (!siteUrl || isChecking) return null;

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
