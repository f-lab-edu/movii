import {
  MovieDetailRequestParams,
  MovieFetchType,
  MoviesRequestParams,
} from '@/features/movie/types';

export const movieQueryKeys = {
  all: ['movies'] as const,
  list: (type: MovieFetchType, { page, language }: MoviesRequestParams) =>
    [...movieQueryKeys.all, 'list', { type, page, language }] as const,
  detail: ({ id, language, appendToResponse }: MovieDetailRequestParams) =>
    [...movieQueryKeys.all, 'detail', { id, language, appendToResponse }] as const,
};
