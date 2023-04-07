'use client';

import { Analytics } from '@vercel/analytics/react';
import './globals.css';

import { LookupProvider } from '~/store';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <LookupProvider>
        <body className='bg-indigo-100 font-poppins'>
          {children}
          <Analytics />
        </body>
      </LookupProvider>
    </html>
  );
}
