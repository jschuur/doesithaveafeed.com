import { LookupOptions, cleanupUrl } from '@doesithaveafeed/shared';
import { useRouter } from 'next/navigation';
import { useCallback, useContext } from 'react';

import { nextFetchOptions } from '~/settings';
import { LookupContext } from '~/store';
import { apiBaseUrl } from '~/util';

export default function useFeedCheck() {
  const router = useRouter();
  const { setFeedUrls, setError, setIsChecking } = useContext<LookupContext>(LookupContext);

  const check = useCallback(
    async (url: string, options: LookupOptions) => {
      if (url) {
        try {
          const cleanedUrl = cleanupUrl(url);
          setFeedUrls(null);
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
    [router, setFeedUrls, setError, setIsChecking]
  );

  return { check };
}
