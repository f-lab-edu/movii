import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Layout from '@/components/layout';

const Home = lazy(() => import('@/pages/home'));
const MovieDetail = lazy(() => import('@/pages/movie-detail'));
const Credits = lazy(() => import('@/pages/movie-detail/credits'));
const NotFound = lazy(() => import('@/pages/not-found'));
const People = lazy(() => import('@/pages/people'));
const Search = lazy(() => import('@/pages/search'));

const TanstackDevtools = import.meta.env.DEV
  ? lazy(() => import('@/add-ons/tanstack-query-devtools'))
  : () => null;

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/contents/:id',
        element: <MovieDetail />,
      },
      {
        path: '/contents/:id/credits',
        element: <Credits />,
      },
      {
        path: '/people/:id',
        element: <People />,
      },
      {
        path: '/search',
        element: <Search />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div>Loading...</div>}>
        <RouterProvider router={router} />
      </Suspense>
      <Suspense>
        <TanstackDevtools />
      </Suspense>
    </QueryClientProvider>
  );
}

export default App;
