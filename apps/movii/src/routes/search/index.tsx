import { useSearchParams } from 'react-router';

import SearchMain from '@/routes/search/components/search-main';
import SearchResults from '@/routes/search/components/search-results';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';

  if (!query) {
    return <SearchMain />;
  }

  return (
    <div className="p-2 max-w-[1680px] mx-auto">
      <SearchResults />
    </div>
  );
};

export default Search;
