import { Dispatch, ReactNode, SetStateAction, createContext, useState } from 'react';

import { FeedUrl, LookupStatus } from '~/types';

export type LookupContext = {
  feedUrls: FeedUrl[];
  setFeedUrls: Dispatch<SetStateAction<FeedUrl[]>>;
  error: any;
  setError: Dispatch<SetStateAction<string>>;
  lookupStatus: LookupStatus;
  setLookupStatus: (status: LookupStatus) => void;
};

export const LookupContext = createContext<LookupContext>({} as LookupContext);

export function LookupProvider({ children }: { children: ReactNode }) {
  const [feedUrls, setFeedUrls] = useState<FeedUrl[]>([]);
  const [error, setError] = useState<string>('');
  const [lookupStatus, setLookupStatus] = useState<LookupStatus>('clear');

  const store = {
    feedUrls,
    setFeedUrls,
    error,
    setError,
    lookupStatus,
    setLookupStatus,
  };

  return <LookupContext.Provider value={store}>{children}</LookupContext.Provider>;
}
