/// <reference types="vite/client" />

declare module '*.webp';
declare module '*.png';
declare module '*.jpg';
declare module '*.svg';
declare module '*.css';
declare module '*.scss';
declare module '*.sass';

type Paging<T> = {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
};

interface ImportMetaEnv {
  readonly VITE_TMDB_API_ACCESS_TOKEN: string;
}
