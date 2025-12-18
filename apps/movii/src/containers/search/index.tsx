import { useRouter } from 'next/router';

import SearchMain from '@/containers/search/components/search-main';
import SearchResults from '@/containers/search/components/search-results';

const Search = () => {
  const router = useRouter();
  const query = router.query.query as string;

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
