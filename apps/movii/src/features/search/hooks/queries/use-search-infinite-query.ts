import { useSuspenseInfiniteQuery } from '@tanstack/react-query';

import { searchQueryKeys } from '@/features/search/hooks/queries/query-keys';
import { SearchRequestParams, SearchResponse, SearchType } from '@/features/search/types';
import { api } from '@/utils/api';

const search = <T extends SearchType>(
  type: T,
  params: SearchRequestParams,
): Promise<SearchResponse<T>> => api.get(`/3/search/${type}`, { params }).then((res) => res.data);

export const useSearchInfiniteQuery = <T extends SearchType>(
  type: T,
  params: SearchRequestParams,
) => {
  return useSuspenseInfiniteQuery({
    queryKey: searchQueryKeys.search(type, params),
    queryFn: ({ pageParam = 1 }) => search(type, { ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    staleTime: Infinity,
    gcTime: Infinity,
  });
};
