import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { InView } from 'react-intersection-observer';

import posterFallbackImage from '@/assets/images/poster-fallback.svg';
import AsyncBoundary from '@/components/async-boundary';
import PosterCard from '@/components/poster-card';
import Profile from '@/components/profile';
import { FALLBACK_AVATAR_IMAGE_URL } from '@/constants';
import ResultEmpty from '@/containers/search/components/search-results/result-empty';
import ResultError from '@/containers/search/components/search-results/result-error';
import ResultLoading from '@/containers/search/components/search-results/result-loading';
import { useMultiSearchInfiniteQuery } from '@/features/search/hooks/queries/use-multi-search-infinite-query';

type SearchListItemProps = {
  title: string;
  posterPath: string;
  date: string;
  category: '영화' | '시리즈';
};

const SearchListItem = ({ title, date, posterPath, category }: SearchListItemProps) => {
  return (
    <li className="flex items-center gap-3.5 py-2">
      {posterPath ? (
        <PosterCard
          imagePath={posterPath}
          title={title}
          width={48}
          height={48}
          className="size-12"
        />
      ) : (
        <Image
          className="object-cover bg-(--color-background30)  overflow-hidden cursor-pointer rounded"
          src={posterFallbackImage.src}
          width={48}
          height={48}
          alt="이미지 없음"
        />
      )}
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
  const router = useRouter();
  const query = router.query.query as string;
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
            <Link key={result.id} href={`/contents/${result.id}`}>
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
              href={router.asPath.split('#')[0]}
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
            <Link key={peopleId} href={`/people/${peopleId}?name=${result.name}`}>
              <Profile className="py-2">
                <Profile.Image
                  path={result.profilePath ?? FALLBACK_AVATAR_IMAGE_URL}
                  alt={`${result.name}의 프로필 사진`}
                  className="size-[42px]"
                  width={42}
                  height={42}
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
