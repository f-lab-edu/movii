import Meta from '@/components/meta';
import GenreSection from '@/containers/search/components/search-main/genre-section';
import PopularSearchKeywordsSection from '@/containers/search/components/search-main/popular-search-keywords-section';

const SearchMain = () => {
  return (
    <>
      <Meta />
      <div className="max-w-[1680px] mx-auto">
        <div className="px-10 pb-8">
          <PopularSearchKeywordsSection />
        </div>
        <GenreSection />
      </div>
    </>
  );
};

export default SearchMain;
