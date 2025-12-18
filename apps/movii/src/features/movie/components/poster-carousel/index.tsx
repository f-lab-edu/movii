import { Carousel } from 'movii-carousel';
import Link from 'next/link';
import { memo } from 'react';

import PosterCard from '@/components/poster-card';
import { useMoviesInfiniteQuery } from '@/features/movie/hooks/queries/use-movies-infinite-query';
import { MovieFetchType } from '@/features/movie/types';

type PosterCarouselProps = {
  type: MovieFetchType;
  carouselTitle: string;
};

const PosterCarousel = ({ type, carouselTitle }: PosterCarouselProps) => {
  const { data } = useMoviesInfiniteQuery(type);

  const movies = data?.pages[0]?.results || [];

  if (!movies.length) {
    return (
      <div className="flex justify-center items-center h-10">
        <p className="text-gray-500">No {carouselTitle} movies found.</p>
      </div>
    );
  }

  return (
    <div className="group px-10">
      <h2 className="text-(--color-primary-text) text-xl mb-[5px]">{carouselTitle}</h2>
      <Carousel.Root slidesPerView={8} spaceBetween={12} loop>
        <Carousel.Content>
          {movies.map((movie) => (
            <Link key={movie.id} href={`/contents/${movie.id}`}>
              <PosterCard
                title={movie.title}
                imagePath={movie.posterPath}
                className="aspect-2/3 hover:brightness-80"
                width={190}
                height={285}
              />
            </Link>
          ))}
        </Carousel.Content>
        <div className="group-hover:visible invisible">
          <Carousel.PrevButton className="-left-10! h-full" />
          <Carousel.NextButton className="-right-10! h-full" />
        </div>
      </Carousel.Root>
    </div>
  );
};

export default memo(PosterCarousel);
