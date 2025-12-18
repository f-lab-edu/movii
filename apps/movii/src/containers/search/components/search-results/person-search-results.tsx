import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { InView } from 'react-intersection-observer';

import AsyncBoundary from '@/components/async-boundary';
import Profile from '@/components/profile';
import { FALLBACK_AVATAR_IMAGE_URL } from '@/constants';
import ResultEmpty from '@/containers/search/components/search-results/result-empty';
import ResultError from '@/containers/search/components/search-results/result-error';
import { useSearchInfiniteQuery } from '@/features/search/hooks/queries/use-search-infinite-query';

const ListContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <ul className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-x-2.5 gap-y-8 pt-[55px] px-10 pb-8">
      {children}
    </ul>
  );
};

const ProfileLoading = () => {
  return (
    <>
      {[...Array(8)].map((_, index) => (
        <li key={index} className="max-size-[12.5%] size-full animate-pulse">
          <div className="shrink-0 aspect-square bg-(--color-background30) rounded-full" />
          <div className="mt-2 h-4 bg-(--color-background30) rounded-md" />
          <div className="mt-1 h-3 bg-(--color-background30) rounded-md w-3/4 mx-auto" />
        </li>
      ))}
    </>
  );
};

const Contents = () => {
  const router = useRouter();
  const query = router.query.query as string;
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useSearchInfiniteQuery(
    'person',
    {
      query,
      language: 'ko',
    },
  );

  const results = useMemo(() => data?.pages?.flatMap((page) => page.results) || [], [data]);

  if (!results.length) {
    return <ResultEmpty />;
  }
  return (
    <>
      <ListContainer>
        {results.map((result) => (
          <li key={result.id} className="max-size-[12.5%] size-full">
            <Link href={`/people/${result.id}?name=${result.name}`}>
              <Profile className="flex-col gap-[3px]">
                <Profile.Image
                  path={result.profilePath ?? FALLBACK_AVATAR_IMAGE_URL}
                  alt={`${result.name}의 프로필 사진`}
                  className="shrink-0 size-full aspect-square"
                  width={136}
                  height={136}
                />
                <div className="text-center">
                  <Profile.Name className="text-white text-[15px] font-medium">
                    {result.name}
                  </Profile.Name>
                  {result.knownForDepartment && (
                    <Profile.Role className="text-[14px]">{result.knownForDepartment}</Profile.Role>
                  )}
                </div>
              </Profile>
            </Link>
          </li>
        ))}
        {isFetchingNextPage && <ProfileLoading />}
      </ListContainer>
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

const PersonSearchResults = () => {
  return (
    <AsyncBoundary
      pendingFallback={
        <ListContainer>
          <ProfileLoading />
        </ListContainer>
      }
      FallbackComponent={ResultError}
    >
      <Contents />
    </AsyncBoundary>
  );
};

export default PersonSearchResults;
