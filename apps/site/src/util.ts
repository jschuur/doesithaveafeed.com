// handle Vercel hosted Next.js API route or SST hosted version
export const apiBaseUrl = (path: string) => `${process.env.NEXT_PUBLIC_API_URL || '/api/'}${path}`;
