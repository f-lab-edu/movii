import { Link, useLocation, useNavigate, useSearchParams } from 'react-router';

import Button from '@/components/button';
import PersonSearchResults from '@/routes/search/components/search-results/person-search-results';
import PopularSearchResults from '@/routes/search/components/search-results/popular-search-results';
import PosterSearchResults from '@/routes/search/components/search-results/poster-search-results';
import { cn } from '@/utils/cn';

const TAB_MENU = [
  { name: '인기', domain: 'all' },
  { name: '영화', domain: 'movie' },
  { name: '시리즈', domain: 'tv' },
  { name: '인물', domain: 'person' },
];

const Tabs = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  return (
    <ul className="flex items-center pb-8 px-10">
      {TAB_MENU.map((tab) => {
        const currentDomain = searchParams.get('domain') || 'all';
        const isActive = currentDomain === tab.domain;
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('domain', tab.domain);

        return (
          <li
            key={tab.domain}
            className={cn(
              'py-3.5 px-5 border-b-2 border-b-transparent',
              isActive && 'border-b-(--color-primary-text)',
            )}
          >
            <Link to={`${location.pathname}?${newSearchParams.toString()}`}>
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

const SEARCH_RESULTS = {
  all: <PopularSearchResults />,
  movie: <PosterSearchResults query="movie" />,
  tv: <PosterSearchResults query="tv" />,
  person: <PersonSearchResults />,
};

const InvalidAccess = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-96 gap-2">
      <p className="text-(--color-gray50)">잘못된 접근입니다.</p>
      <Button priority="secondary" className="p-2" onClick={() => navigate(-1)}>
        뒤로 가기
      </Button>
    </div>
  );
};

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const domain = searchParams.get('domain') || 'all';

  return (
    <>
      <Tabs />
      {SEARCH_RESULTS[domain as keyof typeof SEARCH_RESULTS] || <InvalidAccess />}
    </>
  );
};

export default SearchResults;
