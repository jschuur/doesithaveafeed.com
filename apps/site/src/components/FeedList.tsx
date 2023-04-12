'use client';

import { uniqBy } from 'lodash';
import pluralize from 'pluralize';
import { useContext } from 'react';

import { LookupContext } from '~/store';

export default function FeedList() {
  const { feedUrls, error, lookupStatus } = useContext(LookupContext);
  let status;

  if (lookupStatus === 'clear') return null;

  const validatedFeedUrls = uniqBy(
    feedUrls.filter((feedUrl) => feedUrl.validated),
    `url`
  );

  if (lookupStatus === 'completed')
    status = validatedFeedUrls.length
      ? `Found ${pluralize('feed', validatedFeedUrls.length, true)}:`
      : 'No feeds found.';
  else if (lookupStatus === 'in_progress') {
    const recentCheck = feedUrls.reverse().find((feedUrl) => feedUrl.lookupStatus === 'completed');
    if (recentCheck) status = `${recentCheck.url}...`;
  }

  // TODO: explicitly say no validated feeds found

  return (
    <div className='py-4'>
      {error ? (
        <span>{error}</span>
      ) : (
        <>
          <h2>{lookupStatus === 'in_progress' ? 'Scanning' : 'Results'}</h2>
          {/* List # feed locations checked at the end */}
          <div className='py-2'>{status}</div>
          {validatedFeedUrls.length > 0 && (
            <ul className='py-2'>
              {validatedFeedUrls.map(({ url, autoDiscovery }) => (
                <li key={url} className='ml-8 list-disc'>
                  <a href={url}>{url}</a> {autoDiscovery && '(auto-discovery)'}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
