import { Metadata } from 'next';

import FeedList from '~/components/FeedList';
import LookupForm from '~/components/LookupForm';

export const metadata: Metadata = {
  title: 'Does it Have a Feed?',
  description: 'Find out if or when a website has an RSS (or Atom) syndication feed.',
  alternates: {
    types: {
      'application/rss+xml': [{ title: 'Does it Have a Feed?', url: '/rss.xml' }],
    },
  },
};

export default function Home() {
  return (
    <main className='min-h-[100svh] flex flex-col items-center justify-top mx-auto'>
      <div className='w-full md:w-min flex-grow px-4'>
        <h1 className='pt-12 pb-10 md:pb-16 md:pt-24 text-center'>Does it Have a Feed?</h1>
        <div>
          <LookupForm />
          <FeedList />
        </div>
      </div>
      <div className='mb-4'>
        <a href='http://joostschuur.com'>Joost Schuur</a> &middot;{' '}
        <a href='https://twitter.com/joostschuur'>@joostschuur</a> &middot;{' '}
        <a href='https://github.com/jschuur/doesithaveafeed.com'>GitHub repo</a>
      </div>
    </main>
  );
}
