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

  const render = (node: React.ReactNode) => <div className='py-8'>{node}</div>;

  // TODO: explicitly say no validated feeds found
  if (isChecking) return render(<div className='center'>Checking...</div>);

  if (error) return render(<div>{error}</div>);

  if (validatedFeedUrls.length)
    return render(
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
    );

  return render(<div>No feeds found</div>);
}
