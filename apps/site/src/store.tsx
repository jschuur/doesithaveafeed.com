import { ReactNode, createContext, useState } from 'react';

import { FeedUrl } from '@doesithaveafeed/shared';

export type LookupContext = {
  feedUrls: FeedUrl[] | null;
  setFeedUrls: (urls: FeedUrl[] | null) => void;
  error: any;
  setError: (err: string) => void;
  isChecking: boolean;
  setIsChecking: (checking: boolean) => void;
};

export const LookupContext = createContext<LookupContext>({} as LookupContext);

export function LookupProvider({ children }: { children: ReactNode }) {
  const [feedUrls, setFeedUrls] = useState<FeedUrl[] | null>(null);
  const [error, setError] = useState<string>('');
  const [isChecking, setIsChecking] = useState<boolean>(false);

  const store = {
    feedUrls,
    setFeedUrls,
    error,
    setError,
    isChecking,
    setIsChecking,
  };

  return <LookupContext.Provider value={store}>{children}</LookupContext.Provider>;
}
