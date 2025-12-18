import { TrendingRequestParams } from '@/features/trending/types';

export const trendingQueryKeys = {
  all: ['trending'] as const,
  trending: ({ mediaType, timeWindow }: TrendingRequestParams) =>
    [...trendingQueryKeys.all, mediaType, timeWindow] as const,
};
