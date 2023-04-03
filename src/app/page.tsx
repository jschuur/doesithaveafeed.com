import FeedLookup from '~/components/FeedLookup';

export default function Home() {
  return (
    <main className='min-h-[100svh] flex flex-col items-center justify-top mx-auto'>
      <div className='w-full md:w-min pt-8 md:pt-16 flex-grow px-4'>
        <h1 className='text-2xl font-headings md:text-4xl text-center'>Does it Have a Feed?</h1>

        <FeedLookup />
      </div>
      <div className='mb-4'>
        <a href='http://joostschuur.com'>Joost Schuur</a> &middot;{' '}
        <a href='https://twitter.com/joostschuur'>@joostschuur</a> &middot;{' '}
        <a href='https://github.com/jschuur/doesithaveafeed.com'>GitHub repo</a>
      </div>
    </main>
  );
}
