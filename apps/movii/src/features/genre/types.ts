export type Genre = {
  id: number;
  name: string;
};

export type Genres = 'movie' | 'tv';

export type GenresRequestParams = {
  genre: Genres;
  language?: string;
};

export type GenresResponse = {
  genres: Genre[];
};
