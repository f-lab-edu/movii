import { useMemo } from 'react';
import { InView } from 'react-intersection-observer';
import { Link } from 'react-router';

import AsyncBoundary from '@/components/async-boundary';
import PosterCard from '@/components/poster-card';
import { TMDB_API_POSTER_BASE_URL } from '@/constants';
import { useSearchInfiniteQuery } from '@/features/search/hooks/queries/use-search-infinite-query';
import { SearchResultMap } from '@/features/search/types';
import ResultEmpty from '@/routes/search/components/search-results/result-empty';

type PosterSearchResultsProps = {
  query: Extract<keyof SearchResultMap, 'tv' | 'movie'>;
};

const Contents = ({ query }: PosterSearchResultsProps) => {
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useSearchInfiniteQuery(query, {
    query,
    language: 'ko',
  });

  const results = useMemo(
    () => data?.pages?.flatMap((page) => page.results).filter((result) => result.posterPath) || [],
    [data],
  );

  if (!results.length) {
    return <ResultEmpty />;
  }

  return (
    <>
      <ul className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 pt-[55px] px-10 pb-8">
        {results.map((result) => {
          const title =
            query === 'movie' && 'title' in result
              ? result.title
              : 'name' in result
                ? result.name
                : '';

          const to =
            query === 'tv' ? location.pathname + location.search : `/contents/${result.id}`;

          return (
            <li
              key={result.id}
              onClick={() => {
                if (query === 'tv') {
                  alert('준비중입니다.');
                }
              }}
            >
              <Link to={to}>
                <PosterCard
                  title={title}
                  imageUrl={`${TMDB_API_POSTER_BASE_URL}/${result.posterPath}`}
                  className="aspect-2/3 hover:brightness-80"
                />
              </Link>
            </li>
          );
        })}
      </ul>
      <InView
        onChange={(inView) => {
          if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
      />
    </>
  );
};

const PosterSearchResults = ({ query }: PosterSearchResultsProps) => {
  return (
    <AsyncBoundary fallback={<div className="text-white">Error</div>}>
      <Contents query={query} />
    </AsyncBoundary>
  );
};

export default PosterSearchResults;
