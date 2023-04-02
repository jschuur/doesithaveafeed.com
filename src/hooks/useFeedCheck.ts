import { FormInstance } from 'houseform';
import { RefObject, useEffect, useState } from 'react';

import { FeedUrl } from '~/types';

export default function useFeedCheck(url: string, formRef: RefObject<FormInstance>) {
import { nextFetchOptions } from '~/settings';
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

        const { results, error } = await fetch(`/api/check?url=${url}`, nextFetchOptions).then(
          (res) => res.json()
        );

        if (error) setError(error);
        else {
          setFeedUrls(results);
        }
      } catch (e) {
        if (e instanceof Error) console.error(e.message);

        setError(`HTTP error: ${(e as any).message}`);
      } finally {
        setIsChecking(false);

        if (formRef.current) formRef.current.reset();
      }
    };

    if (url) check();
  }, [url, formRef]);

  return { feedUrls, error, isChecking };
}
