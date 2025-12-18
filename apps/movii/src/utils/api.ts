import axios, { AxiosError } from 'axios';

import { convertKeysToCamelCase, convertKeysToSnakeCase } from '@/utils/string';

declare module 'axios' {
  interface AxiosRequestConfig {
    skipErrorHandler?: boolean;
  }
}

export const api = axios.create({
  baseURL: 'https://api.themoviedb.org',
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_ACCESS_TOKEN}`,
  },
  timeout: 20000,
});

// TODO. Add Error Dialog or Toast Message
const showMessage = async (error: Error) => {
  if (!(error instanceof AxiosError)) {
    console.warn('[Axios] unknown error', error);
    return;
  }

  if (error.response) {
    console.warn(`[Axios] error with status ${error.response.status}`, error.response);
  }
};

api.interceptors.request.use(
  (req) => {
    if (req.params) {
      req.params = convertKeysToSnakeCase(req.params);
    }
    return req;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (res) => {
    if (res.data) {
      res.data = convertKeysToCamelCase(res.data);
    }
    return res;
  },
  (error) => {
    if (error.config?.skipErrorHandler) {
      return Promise.reject(error);
    }
    showMessage(error);
    return Promise.reject(error);
  },
);
