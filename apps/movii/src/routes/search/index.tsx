import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { useLoaderData, useSearchParams } from 'react-router';

import { genresQueryOptions } from '@/features/genre/hooks/quries/use-genres-query';
import { trendingQueryOptions } from '@/features/trending/hooks/queries/use-trending-query';
import SearchMain from '@/routes/search/components/search-main';
import SearchResults from '@/routes/search/components/search-results';

export async function loader() {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery(
      trendingQueryOptions({
        mediaType: 'all',
        timeWindow: 'day',
        language: 'ko',
      }),
    ),
    queryClient.prefetchQuery(
      genresQueryOptions({
        genre: 'movie',
        language: 'ko',
      }),
    ),
    queryClient.prefetchQuery(
      genresQueryOptions({
        genre: 'tv',
        language: 'ko',
      }),
    ),
  ]);

  return {
    dehydratedState: dehydrate(queryClient),
  };
}

const Search = () => {
  const { dehydratedState } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';

  if (!query) {
    return (
      <HydrationBoundary state={dehydratedState}>
        <SearchMain />
      </HydrationBoundary>
    );
  }

  return (
    <div className="p-2 max-w-[1680px] mx-auto">
      <SearchResults />
    </div>
  );
};

export default Search;
