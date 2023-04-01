// url was blank when using the Next.js 13 version of fetch, so using node-fetch instead
import fetch from 'node-fetch';

export const makeAbsoluteUrl = (base: string, url: string) =>
  url.startsWith('http') ? url : `${base}${url}`;

export async function validateUrl(url: string): Promise<boolean> {
  const result = await fetch(url, { method: 'HEAD' });

  return (result.status === 200 && result.url.length > 0) || false;
}
