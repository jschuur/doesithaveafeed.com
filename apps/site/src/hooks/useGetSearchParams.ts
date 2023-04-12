import { useSearchParams } from 'next/navigation';

import { URLParamsSchema } from '~/types';

export default function useGetSearchParams() {
  const searchParams = useSearchParams();

  const params = Object.fromEntries(new URLSearchParams(searchParams).entries());

  return URLParamsSchema.parse(params);
}
