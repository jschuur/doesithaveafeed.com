import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <main className='flex h-screen items-center justify-center'>
      <div className='text-xl'>Does it have a feed?</div>
    </main>
  );
}
