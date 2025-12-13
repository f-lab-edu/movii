import { SearchRequestParams, SearchType } from '@/features/search/types';

export const searchQueryKeys = {
  all: ['search'] as const,
  multiSearch: ({ query, includeAdult: include_adult, page, language }: SearchRequestParams) =>
    [...searchQueryKeys.all, 'multi', { query, include_adult, page, language }] as const,
  search: (type: SearchType, params: SearchRequestParams) =>
    [...searchQueryKeys.all, type, params] as const,
};
