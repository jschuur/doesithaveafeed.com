import FeedLookup from '~/components/FeedLookup';

export default function Home() {
  return (
    <main className='min-h-[100svh] flex flex-col items-center justify-top mx-auto'>
      <div className='w-full md:w-min flex-grow px-4'>
        <h1 className='pt-12 pb-10 md:pb-16 md:pt-24 text-center'>Does it Have a Feed?</h1>
        <div>
          <FeedLookup />
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
