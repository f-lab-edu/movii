import { MovieCreditsRequestParams } from '@/features/people/types';

export const peopleQueryKeys = {
  all: ['people'] as const,
  movieCredits: ({ personId, language }: MovieCreditsRequestParams) =>
    [...peopleQueryKeys.all, 'movieCredits', { personId, language }] as const,
};
