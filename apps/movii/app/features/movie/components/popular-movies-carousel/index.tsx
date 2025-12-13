import { Carousel, useCarouselState } from 'movii-carousel';
import { memo, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';

import { TMDB_API_POSTER_BASE_URL } from '@/constants';
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
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const isActive = activeSlideIndex === index;

  useEffect(() => {
    if (isActive) {
      const animationId = requestAnimationFrame(() => {
        setShouldAnimate(true);
      });
      return () => cancelAnimationFrame(animationId);
    }
    setShouldAnimate(false);
  }, [isActive]);

  const imagePath = movie.backdropPath || movie.posterPath;

  return (
    <div key={movie.id} className="relative w-full h-full">
      <Link to={`/contents/${movie.id}`}>
        <img
          src={`${TMDB_API_POSTER_BASE_URL}${imagePath}`}
          alt={`${movie.title} poster`}
          className="w-full h-full object-cover"
        />
        <div
          className={cn(
            'absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-6',
            isActive ? 'transition-all duration-700 ease-out' : 'transition-none',
            shouldAnimate && isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full',
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
