import { FormInstance } from 'houseform';
import { useRouter } from 'next/navigation';
import { Dispatch, RefObject, SetStateAction, useCallback, useState } from 'react';

import { FeedUrl, LookupOptions } from '../../../../packages/shared/src/types';
import { nextFetchOptions } from '../settings';
import { apiBaseUrl, cleanupUrl } from '../util';

export default function useFeedCheck() {
  const [feedUrls, setFeedUrls] = useState<FeedUrl[]>([]);
  const [error, setError] = useState<string>('');
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const router = useRouter();

  const check = useCallback(
    async (
      url: string,
      options: LookupOptions,
      formRef: RefObject<FormInstance>,
      setUrl: Dispatch<SetStateAction<string>>
    ) => {
      if (url) {
        try {
          const cleanedUrl = cleanupUrl(url);
          setUrl(cleanedUrl);
          setFeedUrls([]);
          setError('');
          setIsChecking(true);

          const { results, error } = await fetch(
            `${apiBaseUrl('check')}?url=${cleanedUrl}&scanForFeeds=${
              options.scanForFeeds
            }&scanAll=${options.scanAll}`,
            nextFetchOptions
          ).then((res) => res.json());

          if (error) setError(error);
          else {
            setFeedUrls(results);
            router.push('/?url=' + encodeURIComponent(cleanedUrl));
          }
        } catch (e) {
          if (e instanceof Error) console.error(e.message);

          setError(`Error: ${(e as any).message}`);
        } finally {
          setIsChecking(false);

          if (formRef.current) formRef.current.reset();
        }
      }
    },
    [router]
  );

  return { feedUrls, error, isChecking, check };
}
