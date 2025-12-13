import { useSuspenseQuery } from '@tanstack/react-query';

import { movieQueryKeys } from '@/features/movie/hooks/queries/query-keys';
import { MovieDetailRequestParams, MovieDetailResponse } from '@/features/movie/types';
import { api } from '@/utils/api';

type MovieDetailFetcher = (params: MovieDetailRequestParams) => Promise<MovieDetailResponse>;

const fetchMovie: MovieDetailFetcher = ({ id, language, appendToResponse }) =>
  api.get(`/3/movie/${id}`, { params: { language, appendToResponse } }).then((res) => res.data);

// 감독을 cast 맨 앞에 추가하고 crew 배열은 빈 배열로 변환
const transformCreditsData = (data: MovieDetailResponse) => {
  if (!data?.credits) {
    return data;
  }

  const credits = { ...data.credits };
  const directors = credits.crew.filter((member) => member.job === 'Director');

  let cast = credits.cast ? [...credits.cast] : [];
  if (directors.length > 0) {
    const director = directors[0];
    const directorAsCast = {
      ...director,
      castId: -1,
      character: director.job,
      order: -1,
    };
    cast = [directorAsCast, ...cast];
  }

  return {
    ...data,
    credits: {
      ...credits,
      cast,
      crew: [],
    },
  };
};

const useMovieQuery = ({ id, language, appendToResponse }: MovieDetailRequestParams) => {
  return useSuspenseQuery({
    queryKey: movieQueryKeys.detail({ id, language, appendToResponse }),
    queryFn: () => fetchMovie({ id, language, appendToResponse }),
    select: transformCreditsData,
    staleTime: Infinity,
    gcTime: Infinity,
  });
};

export default useMovieQuery;
