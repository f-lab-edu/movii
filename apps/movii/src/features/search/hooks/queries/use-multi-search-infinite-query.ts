import { useSuspenseInfiniteQuery } from '@tanstack/react-query';

import { searchQueryKeys } from '@/features/search/hooks/queries/query-keys';
import { MultiSearchResult, SearchRequestParams } from '@/features/search/types';
import { api } from '@/utils/api';

type MultiSearchFetcher = (params: SearchRequestParams) => Promise<Paging<MultiSearchResult>>;

const multiSearch: MultiSearchFetcher = async (params) =>
  api.get('/3/search/multi', { params }).then((res) => res.data);

export const useMultiSearchInfiniteQuery = (params: SearchRequestParams) => {
  return useSuspenseInfiniteQuery({
    queryKey: searchQueryKeys.multiSearch(params),
    queryFn: ({ pageParam = 1 }) => multiSearch({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    staleTime: Infinity,
    gcTime: Infinity,
  });
};
