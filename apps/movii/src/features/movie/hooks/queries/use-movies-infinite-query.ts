import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { snake } from 'radash';

import { movieQueryKeys } from './query-keys';

import { Movie, MovieFetchType, MoviesRequestParams } from '@/features/movie/types';
import { api } from '@/utils/api';

type MoviesFetcher = (type: MovieFetchType, params: MoviesRequestParams) => Promise<Paging<Movie>>;

const fetchMovies: MoviesFetcher = (type, params) =>
  api.get(`/3/movie/${snake(type)}`, { params }).then((res) => res.data);

export const useMoviesInfiniteQuery = (type: MovieFetchType, params?: MoviesRequestParams) => {
  const { page, language } = params || { page: 1, language: 'ko' };

  return useSuspenseInfiniteQuery({
    queryKey: movieQueryKeys.list(type, { page, language }),
    queryFn: ({ pageParam }) => {
      const resolvedPage = typeof pageParam === 'number' ? pageParam : page;
      return fetchMovies(type, { page: resolvedPage, language });
    },
    initialPageParam: page,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
