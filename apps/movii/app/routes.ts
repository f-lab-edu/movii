import { type RouteConfig, index, layout, prefix, route } from '@react-router/dev/routes';

export default [
  layout('components/layout.tsx', [
    index('routes/home.tsx'),

    ...prefix('contents', [
      route(':id', 'routes/movie-detail/index.tsx'),
      route(':id/credits', 'routes/movie-detail/credits.tsx'),
    ]),

    ...prefix('people', [route(':id', 'routes/people.tsx')]),

    route('search', 'routes/search/index.tsx'),

    route('*', 'routes/not-found.tsx'),
  ]),
] satisfies RouteConfig;
