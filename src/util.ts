// url was blank when using the Next.js 13 version of fetch, so using node-fetch instead
import fetch from 'node-fetch';

export const makeAbsoluteUrl = (base: string, url: string) =>
  url.startsWith('http') ? url : `${base}${url}`;

export async function validateUrl(url: string): Promise<boolean> {
  const result = await fetch(url, { method: 'HEAD' });

  return (result.status === 200 && result.url.length > 0) || false;
}

export function cleanupUrl(url: string): string {
  if (!(url.startsWith('http://') || url.startsWith('https://'))) url = `https://${url}`;

  // this (conveniently) also adds a trailing slash if there isn't one
  const parsedUrl = new URL(url);

  return parsedUrl.toString();
}
