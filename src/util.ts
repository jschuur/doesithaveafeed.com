export const makeAbsoluteUrl = (base: string, url: string) =>
  url.startsWith('http') ? url : `${base}${url}`;

export async function validateUrl(url: string): Promise<boolean> {
  const result = await fetch(url, { method: 'HEAD', cache: 'no-store' });

  return result.status === 200 || false;
}

export function cleanupUrl(url: string): string {
  const originalUrl = url;

  if (!(url.toLowerCase().startsWith('http://') || url.toLowerCase().startsWith('https://')))
    url = `https://${url}`;

  // this (conveniently) also adds a trailing slash if there isn't one
  try {
    const parsedUrl = new URL(url.trim());

    return parsedUrl.toString();
  } catch {
    throw new Error(`Invalid URL ${originalUrl}`);
  }
}

export function isValidUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url.trim());

    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch (error) {
    return false;
  }
}

// handle Vercel hosted Next.js API route or SST hosted version
export const apiBaseUrl = (path: string) => `${process.env.NEXT_PUBLIC_API_URL || '/api/'}${path}`;
