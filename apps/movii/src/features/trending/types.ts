import { MovieWithMediaType } from '@/features/movie/types';
import { PersonWithMediaType } from '@/features/people/types';
import { TvWithMediaType } from '@/features/tv/types';

export const TrendingMediaTypeMap = {
  all: '전체',
  movie: '영화',
  tv: '시리즈',
  person: '인물',
} as const;

export type TrendingMediaType = keyof typeof TrendingMediaTypeMap;

export type TrendingTimeWindow = 'day' | 'week';

export type TrendingRequestParams = {
  mediaType: TrendingMediaType;
  timeWindow: TrendingTimeWindow;
  language?: string;
};

export type TrendingResult = MovieWithMediaType | TvWithMediaType | PersonWithMediaType;
