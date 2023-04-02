import { FormInstance } from 'houseform';
import { RefObject, useEffect, useState } from 'react';

import { nextFetchOptions } from '~/settings';
import { FeedUrl, LookupOptions } from '~/types';
import { cleanupUrl } from '~/util';

export default function useFeedCheck(
  url: string,
  options: LookupOptions,
  formRef: RefObject<FormInstance>
) {
  const [feedUrls, setFeedUrls] = useState<FeedUrl[]>([]);
  const [error, setError] = useState<string>('');
  const [isChecking, setIsChecking] = useState<boolean>(false);

  useEffect(() => {
    const check = async (url: string) => {
      try {
        console.log(`Checking ${url} for feeds... (${JSON.stringify(options)})`);
        setIsChecking(true);
        setError('');
        setFeedUrls([]);

        const { results, error } = await fetch(
          `/api/check?url=${url}&scanForFeeds=${options.scanForFeeds}&scanAll=${options.scanAll}`,
          nextFetchOptions
        ).then((res) => res.json());

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

    try {
      const cleanedUrl = cleanupUrl(url);

      check(cleanedUrl);
    } catch (error) {
      if (error instanceof Error) setError(error.message);
    }
  }, [url, options, formRef]);

  return { feedUrls, error, isChecking };
}
