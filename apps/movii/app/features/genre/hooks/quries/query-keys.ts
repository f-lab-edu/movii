import { GenresRequestParams } from '@/features/genre/types';

export const genreKeys = {
  all: ['genre'] as const,
  list: ({ genre, language }: GenresRequestParams) =>
    [...genreKeys.all, 'list', { genre, language }] as const,
};
