import { RefObject, useEffect, useState } from 'react';

import { FeedUrl } from '~/types';

export default function useFeedCheck(url: string, urlInputRef: RefObject<HTMLInputElement>) {
  const [feedUrls, setFeedUrls] = useState<FeedUrl[]>([]);
  const [error, setError] = useState<string>('');
  const [isChecking, setIsChecking] = useState<boolean>(false);

  useEffect(() => {
    const check = async () => {
      try {
        console.log(`Checking ${url} for feeds...`);
        setIsChecking(true);
        setError('');
        setFeedUrls([]);

        // TODO: set appropriate cache time, use node-fetch or clear cache for testing?
        const { results, error } = await fetch(`/api/check?url=${url}`).then((res) => res.json());

        if (error) setError(error);
        else {
          setFeedUrls(results);
        }
      } catch (e) {
        setError(`HTTP error: ${(e as any).message}`);
      } finally {
        setIsChecking(false);

        if (urlInputRef.current) {
          console.log('Clearing URL input and focusing it...');

          urlInputRef.current.value = '';
          urlInputRef.current?.focus();
        } else console.warn("Couldn't not reset URL input");
      }
    };

    if (url) check();
  }, [url, urlInputRef]);

  return { feedUrls, error, isChecking };
}
