// url was blank when using the Next.js 13 version of fetch, so using node-fetch instead
import fetch, { Response } from 'node-fetch';

export const makeAbsoluteUrl = ({ base, url }: { base: string; url: string }) =>
  url.startsWith('http') ? url : `${base}${url}`;

export async function validateUrls(urls: string[]) {
  const checks = await Promise.allSettled<Response>(
    urls.map((url) => fetch(url, { method: 'HEAD' }))
  );

  return (
    checks.filter(
      (result) =>
        result.status === 'fulfilled' && result.value.status === 200 && result.value.url.length
    ) as PromiseFulfilledResult<Response>[]
  ).map((result) => result.value.url);
}
