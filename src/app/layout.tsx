import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Does it Have a Feed?',
  description: 'Find out if or when a website has an RSS (or Atom) syndication feed.',
  alternates: {
    types: {
      'application/rss+xml': [{ title: 'Does it Have a Feed?', url: '/rss.xml' }],
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className='bg-slate-100'>{children}</body>
    </html>
  );
}
