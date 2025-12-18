import { Movie, MovieWithMediaType } from '@/features/movie/types';
import { Person, PersonWithMediaType } from '@/features/people/types';
import { Tv, TvWithMediaType } from '@/features/tv/types';

export type SearchRequestParams = {
  query: string;
  includeAdult?: boolean;
  page?: number;
  language?: string;
};

export type SearchResultMap = {
  movie: Movie;
  tv: Tv;
  person: Person;
};

export type SearchType = keyof SearchResultMap;

export type SearchResponse<T extends SearchType> = Paging<SearchResultMap[T]>;

export type MultiSearchResult = MovieWithMediaType | TvWithMediaType | PersonWithMediaType;
