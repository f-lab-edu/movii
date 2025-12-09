import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { snake } from 'radash';

import { movieQueryKeys } from './query-keys';

import { Movie, MovieFetchType, MoviesRequestParams } from '@/features/movie/types';
import { api } from '@/utils/api';

type MoviesFetcher = (type: MovieFetchType, params: MoviesRequestParams) => Promise<Paging<Movie>>;

export const fetchMovies: MoviesFetcher = (type, params) =>
  api.get(`/3/movie/${snake(type)}`, { params }).then((res) => res.data);

export const useMoviesInfiniteQuery = (type: MovieFetchType, params?: MoviesRequestParams) => {
  const { page, language } = params || { page: 1, language: 'ko' };

  return useSuspenseInfiniteQuery({
    queryKey: movieQueryKeys.list(type, { page, language }),
    queryFn: ({ pageParam = 1 }) => fetchMovies(type, { page: pageParam, language }),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
};
