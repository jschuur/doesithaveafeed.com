'use client';

import FeedList from '~/components/FeedList';
import LookupForm from '~/components/LookupForm';
import { LookupProvider } from '~/store';

export function FeedLookup() {
  return (
    <LookupProvider>
      <div>
        <LookupForm />
        <FeedList />
      </div>
    </LookupProvider>
  );
}
