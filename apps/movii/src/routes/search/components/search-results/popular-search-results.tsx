import { useMemo } from 'react';
import { InView } from 'react-intersection-observer';
import { Link, useSearchParams } from 'react-router';

import posterFallbackImage from '@/assets/images/poster-fallback.svg';
import AsyncBoundary from '@/components/async-boundary';
import PosterCard from '@/components/poster-card';
import Profile from '@/components/profile';
import { FALLBACK_AVATAR_IMAGE_URL, TMDB_API_POSTER_BASE_URL } from '@/constants';
import { useMultiSearchInfiniteQuery } from '@/features/search/hooks/queries/use-multi-search-infinite-query';
import ResultEmpty from '@/routes/search/components/search-results/result-empty';
import ResultError from '@/routes/search/components/search-results/result-error';
import ResultLoading from '@/routes/search/components/search-results/result-loading';

type SearchListItemProps = {
  title: string;
  posterPath: string;
  date: string;
  category: '영화' | '시리즈';
};

const SearchListItem = ({ title, date, posterPath, category }: SearchListItemProps) => {
  return (
    <li className="flex items-center gap-3.5 py-2">
      <PosterCard
        imageUrl={posterPath ? `${TMDB_API_POSTER_BASE_URL}/${posterPath}` : posterFallbackImage}
        title={title}
        className="size-12"
      />
      <div className="flex flex-col">
        <div className="text-white">{title}</div>
        <div className="flex text-(--color-tertiary-text) text-[13px] gap-1">
          <div>{category}</div>
          <div>{'\u00B7'}</div>
          <div>{new Date(date).getFullYear()}</div>
        </div>
      </div>
    </li>
  );
};

const Contents = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useMultiSearchInfiniteQuery({
    query,
    language: 'ko',
    includeAdult: true,
  });

  const results = useMemo(() => data?.pages?.flatMap((page) => page.results) || [], [data]);

  if (!results.length) {
    return <ResultEmpty />;
  }

  return (
    <ul className="pt-[22px] px-10">
      {results.map((result) => {
        if (result.mediaType === 'movie') {
          return (
            <Link key={result.id} to={`/contents/${result.id}`}>
              <SearchListItem
                title={result.title}
                date={result.releaseDate}
                posterPath={result.posterPath || result.backdropPath || ''}
                category="영화"
              />
            </Link>
          );
        }

        if (result.mediaType === 'tv') {
          return (
            // TODO. 시리즈 상세 페이지 구현 후 링크 수정
            <Link
              key={result.id}
              to={location.pathname + location.search}
              onClick={() => alert('준비중입니다.')}
            >
              <SearchListItem
                title={result.name}
                date={result.firstAirDate}
                posterPath={result.posterPath || result.backdropPath || ''}
                category="시리즈"
              />
            </Link>
          );
        }

        if (result.mediaType === 'person') {
          const peopleId = result.id;
          return (
            <Link key={peopleId} to={`/people/${peopleId}?name=${result.name}`}>
              <Profile className="py-2">
                <Profile.Image
                  src={
                    result.profilePath
                      ? `${TMDB_API_POSTER_BASE_URL}/${result.profilePath}`
                      : FALLBACK_AVATAR_IMAGE_URL
                  }
                  alt={`${result.name}의 프로필 사진`}
                  className="size-[42px]"
                />
                <div>
                  <Profile.Name>{result.name}</Profile.Name>
                  <Profile.Role>{result.knownForDepartment}</Profile.Role>
                </div>
              </Profile>
            </Link>
          );
        }

        return null;
      })}
      {isFetchingNextPage && <ResultLoading />}
      <InView
        rootMargin="20px"
        onChange={(inView) => {
          if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
      />
    </ul>
  );
};

const PopularSearchResults = () => {
  return (
    <AsyncBoundary
      pendingFallback={
        <div className="px-10">
          <ResultLoading />
        </div>
      }
      FallbackComponent={ResultError}
    >
      <Contents />
    </AsyncBoundary>
  );
};

export default PopularSearchResults;
