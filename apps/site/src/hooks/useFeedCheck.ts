import { FeedUrl, LookupOptions, cleanupUrl } from '@doesithaveafeed/shared';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';

import { nextFetchOptions } from '~/settings';
import { apiBaseUrl } from '~/util';

export default function useFeedCheck() {
  const [feedUrls, setFeedUrls] = useState<FeedUrl[]>([]);
  const [error, setError] = useState<string>('');
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const router = useRouter();

  const check = useCallback(
    async (url: string, options: LookupOptions, setUrl: Dispatch<SetStateAction<string>>) => {
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
            router.push('/?url=' + encodeURIComponent(url));
          }
        } catch (e) {
          if (e instanceof Error) console.error(e.message);

          setError(`Error: ${(e as any).message}`);
        } finally {
          setIsChecking(false);
        }
      }
    },
    [router]
  );

  return { feedUrls, error, isChecking, check };
}
