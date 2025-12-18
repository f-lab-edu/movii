export type Tv = {
  adult: boolean;
  backdropPath: string | null;
  genreIds: number[];
  id: number;
  originalLanguage: string;
  originalName: string;
  overview: string;
  popularity: number;
  posterPath: string | null;
  firstAirDate: string;
  name: string;
  voteAverage: number;
  voteCount: number;
  originCountry: string[];
};

export type TvWithMediaType = Tv & {
  mediaType: 'tv';
};
