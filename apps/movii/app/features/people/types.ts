import { Movie, MovieWithMediaType } from '@/features/movie/types';
import { TvWithMediaType } from '@/features/tv/types';

export type MovieCreditsRequestParams = {
  personId: number;
  language?: string;
};

export type MovieCreditsResponse = {
  cast: Movie[];
  crew: Movie[];
};

export type Person = {
  adult: boolean;
  id: number;
  name: string;
  originalName: string;
  popularity: number;
  gender: number;
  knownForDepartment: string;
  profilePath: string | null;
  knownFor: (MovieWithMediaType | TvWithMediaType)[];
};

export type PersonWithMediaType = Person & {
  mediaType: 'person';
};
