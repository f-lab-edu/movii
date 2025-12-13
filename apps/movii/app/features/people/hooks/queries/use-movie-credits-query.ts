import { useSuspenseQuery } from '@tanstack/react-query';

import { peopleQueryKeys } from '@/features/people/hooks/queries/query-keys';
import { MovieCreditsRequestParams, MovieCreditsResponse } from '@/features/people/types';
import { api } from '@/utils/api';

type MovieCreditsFetcher = (params: MovieCreditsRequestParams) => Promise<MovieCreditsResponse>;

const fetchMovieCredits: MovieCreditsFetcher = ({ personId, language }) =>
  api.get(`/3/person/${personId}/movie_credits`, { params: { language } }).then((res) => res.data);

const useMovieCreditsQuery = ({ personId, language }: MovieCreditsRequestParams) => {
  return useSuspenseQuery({
    queryKey: peopleQueryKeys.movieCredits({ personId, language }),
    queryFn: () => fetchMovieCredits({ personId, language }),
    staleTime: Infinity,
    gcTime: Infinity,
  });
};

export default useMovieCreditsQuery;
