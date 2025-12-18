import { Carousel, useCarouselState } from 'movii-carousel';
import Link from 'next/link';
import { memo, useMemo } from 'react';

import TmdbImage from '@/components/tmdb-image';
import { useMoviesInfiniteQuery } from '@/features/movie/hooks/queries/use-movies-infinite-query';
import { cn } from '@/utils/cn';

const MovieSlide = ({
  movie,
  index,
}: {
  movie: {
    id: number;
    title: string;
    overview: string;
    backdropPath?: string;
    posterPath?: string;
  };
  index: number;
}) => {
  const { activeSlideIndex } = useCarouselState();
  const isActive = activeSlideIndex === index;

  const imagePath = movie.backdropPath || movie.posterPath || '';

  return (
    <div key={movie.id} className="relative w-full h-full">
      <Link href={`/contents/${movie.id}`}>
        <TmdbImage
          kind="poster"
          path={imagePath}
          alt={`${movie.title} poster`}
          className="w-full h-full object-cover"
          width={1680}
          height={945}
          priority
        />
        <div
          className={cn(
            'absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-6 transition-all duration-700 ease-out',
            isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full',
          )}
        >
          <h3 className="text-white text-5xl font-bold mb-4">{movie.title}</h3>
          <p className="text-gray-200 text-sm line-clamp-2">{movie.overview}</p>
        </div>
      </Link>
    </div>
  );
};

const PopularMoviesCarousel = () => {
  const { data } = useMoviesInfiniteQuery('popular');

  // 첫 페이지의 처음 5개 영화만 사용
  const movies = useMemo(() => data?.pages[0]?.results.slice(0, 5) || [], [data]);

  if (!movies.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">No popular movies found.</p>
      </div>
    );
  }

  return (
    <div>
      <Carousel.Root mode="auto" loop>
        <Carousel.ProgressBar />
        <Carousel.Content>
          {movies.map((movie, index) => (
            <MovieSlide key={movie.id} movie={movie} index={index} />
          ))}
        </Carousel.Content>
        <Carousel.PrevButton />
        <Carousel.NextButton />
        <Carousel.Pagination containerClassName="absolute bottom-0 right-[18px]" />
      </Carousel.Root>
    </div>
  );
};

export default memo(PopularMoviesCarousel);
