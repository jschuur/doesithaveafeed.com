import { FormInstance } from 'houseform';
import { RefObject, useEffect, useState } from 'react';

import { FeedUrl } from '~/types';

export default function useFeedCheck(url: string, formRef: RefObject<FormInstance>) {
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

        if (formRef.current) formRef.current.reset();
      }
    };

    if (url) check();
  }, [url, formRef]);

  return { feedUrls, error, isChecking };
}
