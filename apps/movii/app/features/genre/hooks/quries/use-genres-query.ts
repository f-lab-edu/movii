import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

import { genreKeys } from '@/features/genre/hooks/quries/query-keys';
import { GenresRequestParams, GenresResponse } from '@/features/genre/types';
import { api } from '@/utils/api';

type GenresFetcher = (params: GenresRequestParams) => Promise<GenresResponse>;

const fetchGenres: GenresFetcher = ({ genre, language }) =>
  api.get(`/3/genre/${genre}/list`, { params: { language } }).then((res) => res.data);

export const genresQueryOptions = (params: GenresRequestParams) =>
  queryOptions({
    queryKey: genreKeys.list(params),
    queryFn: () => fetchGenres(params),
    staleTime: Infinity,
    gcTime: Infinity,
  });

const useGenresQuery = (params: GenresRequestParams) => {
  return useSuspenseQuery(genresQueryOptions(params));
};

export default useGenresQuery;
