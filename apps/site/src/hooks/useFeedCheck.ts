import { useRouter } from 'next/navigation';
import { useCallback, useContext } from 'react';

import { LookupContext } from '~/store';
import { FeedCheckParams, FeedCheckParamsSchema, FeedUrlSchema } from '~/types';

export default function useFeedCheck() {
  const router = useRouter();
  const { setFeedUrls, setError, setLookupStatus } = useContext<LookupContext>(LookupContext);

  const check = useCallback(
    async (options: FeedCheckParams) => {
      const params = FeedCheckParamsSchema.parse(options);

      try {
        // use the original URL inputted, for 'nice' URLs
        const searchParams = new URLSearchParams({ url: options.url });
        if (options.scanForFeeds) searchParams.set('scanForFeeds', 'true');
        if (options.scanAll) searchParams.set('scanAll', 'true');

        router.push('/?' + searchParams.toString());

        setFeedUrls([]);
        setError('');
        setLookupStatus('in_progress');

        const response = await fetch('/api/check', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(params),
        });

        if (!response.ok) throw new Error(response.statusText);

        const data = response.body;
        if (!data) return;

        const reader = data.getReader();
        const decoder = new TextDecoder();
        let done = false;

        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          const chunk = decoder.decode(value);

          if (chunk) {
            const chunk = JSON.parse(decoder.decode(value));
            const feedUrl = FeedUrlSchema.parse(chunk);

            setFeedUrls((prev) => [...prev, feedUrl]);
          }
        }
      } catch (e) {
        if (e instanceof Error) console.error(e.message);

        setError(`Error: ${(e as any).message}`);
      } finally {
        setLookupStatus('completed');
      }
    },
    [router, setFeedUrls, setError, setLookupStatus]
  );

  return { check };
}
