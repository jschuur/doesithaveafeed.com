export const makeAbsoluteUrl = (base: string, url: string) =>
  url.startsWith('http') ? url : `${base}${url}`;

export async function validateUrl(url: string): Promise<boolean> {
  const result = await fetch(url, { method: 'HEAD' });

  return result.status === 200 || false;
}

export function cleanupUrl(url: string): string {
  if (!(url.toLowerCase().startsWith('http://') || url.toLowerCase().startsWith('https://')))
    url = `https://${url}`;

  // this (conveniently) also adds a trailing slash if there isn't one
  try {
    const parsedUrl = new URL(url);

    return parsedUrl.toString();
  } catch {
    throw new Error(`Invalid URL ${url}`);
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
