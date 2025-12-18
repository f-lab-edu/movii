import Link from 'next/link';
import { useRouter } from 'next/router';

import Button from '@/components/button';
import Meta from '@/components/meta';
import PersonSearchResults from '@/containers/search/components/search-results/person-search-results';
import PopularSearchResults from '@/containers/search/components/search-results/popular-search-results';
import PosterSearchResults from '@/containers/search/components/search-results/poster-search-results';
import { cn } from '@/utils/cn';

const TAB_MENU = [
  { name: '인기', domain: 'all' },
  { name: '영화', domain: 'movie' },
  { name: '시리즈', domain: 'tv' },
  { name: '인물', domain: 'person' },
] as const;

type SearchDomain = (typeof TAB_MENU)[number]['domain'];

const getFirstQueryValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const isSearchDomain = (value: string): value is SearchDomain =>
  TAB_MENU.some((t) => t.domain === value);

const Tabs = () => {
  const router = useRouter();

  return (
    <ul className="flex items-center pb-8 px-10">
      {TAB_MENU.map((tab) => {
        const currentDomain = getFirstQueryValue(router.query.domain) ?? 'all';
        const isActive = currentDomain === tab.domain;

        return (
          <li
            key={tab.domain}
            className={cn(
              'py-3.5 px-5 border-b-2 border-b-transparent',
              isActive && 'border-b-(--color-primary-text)',
            )}
          >
            <Link
              href={{
                pathname: router.pathname,
                query: {
                  ...router.query,
                  domain: tab.domain,
                },
              }}
              shallow
              scroll={false}
            >
              <span
                className={cn(
                  'text-(--color-disabled-text)',
                  isActive && 'text-(--color-primary-text) text-[15px] leading-5',
                )}
              >
                {tab.name}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

const SEARCH_RESULTS: Record<SearchDomain, React.ReactNode> = {
  all: <PopularSearchResults />,
  movie: <PosterSearchResults query="movie" />,
  tv: <PosterSearchResults query="tv" />,
  person: <PersonSearchResults />,
};

const InvalidAccess = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center h-96 gap-2">
      <p className="text-(--color-gray50)">잘못된 접근입니다.</p>
      <Button priority="secondary" className="p-2" onClick={() => router.back()}>
        뒤로 가기
      </Button>
    </div>
  );
};

const SearchResults = () => {
  const router = useRouter();
  const domainQuery = getFirstQueryValue(router.query.domain);
  const domain: SearchDomain = domainQuery && isSearchDomain(domainQuery) ? domainQuery : 'all';

  return (
    <>
      <Meta />
      <Tabs />
      {SEARCH_RESULTS[domain] || <InvalidAccess />}
    </>
  );
};

export default SearchResults;
