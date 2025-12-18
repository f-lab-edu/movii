import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { InView } from 'react-intersection-observer';

import AsyncBoundary from '@/components/async-boundary';
import PosterCard from '@/components/poster-card';
import ResultEmpty from '@/containers/search/components/search-results/result-empty';
import { useSearchInfiniteQuery } from '@/features/search/hooks/queries/use-search-infinite-query';
import { SearchResultMap } from '@/features/search/types';

type PosterSearchResultsProps = {
  query: Extract<keyof SearchResultMap, 'tv' | 'movie'>;
};

const Contents = ({ query }: PosterSearchResultsProps) => {
  const router = useRouter();
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

          const href = query === 'tv' ? router.asPath.split('#')[0] : `/contents/${result.id}`;

          return (
            <li
              key={result.id}
              onClick={() => {
                if (query === 'tv') {
                  alert('준비중입니다.');
                }
              }}
            >
              <Link href={href}>
                <PosterCard
                  title={title}
                  kind={result.posterPath ? 'poster' : 'backdrop'}
                  imagePath={result.posterPath || result.backdropPath || ''}
                  className="aspect-2/3 hover:brightness-80"
                  width={190}
                  height={285}
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
