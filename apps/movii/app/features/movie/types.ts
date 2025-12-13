import { Genre } from '@/features/genre/types';

export type MovieFetchType = 'nowPlaying' | 'popular' | 'topRated' | 'upcoming';

export type MoviesRequestParams = {
  page?: number;
  language?: 'ko' | 'en-US';
};

export type Movie = {
  adult: boolean;
  backdropPath: string;
  genreIds: number[];
  id: number;
  originalLanguage: string;
  originalTitle: string;
  overview: string;
  popularity: number;
  posterPath: string;
  releaseDate: string;
  title: string;
  video: boolean;
  voteAverage: number;
  voteCount: number;
};

export type MovieWithMediaType = Movie & {
  mediaType: 'movie';
};

type ProductionCompany = {
  id: number;
  logoPath: string;
  name: string;
  originCountry: string;
};

type ProductionCountry = {
  iso_3166_1: string;
  name: string;
};

type SpokenLanguage = {
  englishName: string;
  iso_639_1: string;
  name: string;
};

type BelongsToCollection = {
  id: number;
  name: string;
  posterPath: string | null;
  backdropPath: string | null;
};

type Cast = {
  adult: boolean;
  gender: number;
  id: number;
  knownForDepartment: string;
  name: string;
  originalName: string;
  popularity: number;
  profilePath: string | null;
  castId: number;
  character: string;
  creditId: string;
  order: number;
};

type Crew = {
  adult: boolean;
  gender: number;
  id: number;
  knownForDepartment: string;
  name: string;
  originalName: string;
  popularity: number;
  profilePath: string | null;
  creditId: string;
  department: string;
  job: string;
};

export type Credits = {
  cast: Cast[];
  crew: Crew[];
};

export type MovieDetailRequestParams = {
  id: number;
  language?: string;
  appendToResponse?: string;
};

export type MovieDetailResponse = {
  adult: boolean;
  backdropPath: string;
  belongsToCollection: BelongsToCollection;
  budget: number;
  genres: Genre[];
  homepage: string;
  id: number;
  imdbId: string;
  originalLanguage: string;
  originalTitle: string;
  overview: string;
  popularity: number;
  posterPath: string;
  productionCompanies: ProductionCompany[];
  productionCountries: ProductionCountry[];
  releaseDate: string;
  revenue: number;
  runtime: number;
  spokenLanguages: SpokenLanguage[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  voteAverage: number;
  voteCount: number;
  credits?: Credits;
};

export type MoviesFetcher = (
  type: MovieFetchType,
  params: MoviesRequestParams,
) => Promise<Paging<Movie>>;
