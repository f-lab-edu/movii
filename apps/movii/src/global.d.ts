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
  totalPages: number;
  totalResults: number;
};
