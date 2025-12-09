import { Carousel } from 'movii-carousel';
import { ComponentProps } from 'react';
import { FallbackProps } from 'react-error-boundary';
import { Link } from 'react-router';

import AsyncBoundary from '@/components/async-boundary';
import useGenresQuery from '@/features/genre/hooks/quries/use-genres-query';
import { Genres } from '@/features/genre/types';

const GenreCarouselTitle = ({ children }: ComponentProps<'h2'>) => {
  return <h2 className="text-white font-bold text-xl px-10 mb-[5px]">{children}</h2>;
};

const GenreCarousel = ({ genre }: { genre: Genres }) => {
  const { data } = useGenresQuery({ genre, language: 'ko' });
  return (
    <div className="px-10 pb-8 group">
      <Carousel.Root slidesPerView={4} spaceBetween={12} loop>
        <Carousel.Content>
          {data?.genres.map(({ id, name }) => (
            <Link
              to="#"
              onClick={() => alert('준비중입니다.')}
              key={id}
              className="size-full relative"
            >
              {/* 상단 gradient overlay */}
              <div className="absolute top-0 left-0 w-full h-1/2 pointer-events-none z-10">
                <div className="size-full bg-linear-to-b from-black/60 to-transparent" />
              </div>
              {/* 텍스트 + 그림자 */}
              <div className="absolute top-2 left-2 px-2 py-1 rounded text-white font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] z-20">
                {name}
              </div>
              <img
                // API Response에 이미지가 없어서 랜덤 이미지 활용
                src={`https://picsum.photos/seed/${id}/400/300`}
                alt={name}
                loading="lazy"
                className="size-full rounded bg-(--color-background70) object-cover"
              />
            </Link>
          ))}
        </Carousel.Content>
        <div className="group-hover:visible invisible">
          <Carousel.PrevButton className="-left-10 h-full" />
          <Carousel.NextButton className="-right-10 h-full" />
        </div>
      </Carousel.Root>
    </div>
  );
};

const GenreCarouselLoading = () => (
  <div className="px-10 mb-8">
    <div className="flex gap-3">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div
          key={idx}
          className="rounded overflow-hidden relative w-[400px] h-[300px] bg-(--color-background70) animate-pulse"
        >
          <div className="absolute top-2 left-2 px-2 py-1 rounded bg-black/30 w-24 h-6" />
        </div>
      ))}
    </div>
  </div>
);

const GenreCarouselError = ({ error, resetErrorBoundary }: FallbackProps) => (
  <div className="flex flex-col items-center justify-center py-10">
    <div className="text-(--color-error) font-bold mb-2">
      장르 데이터를 불러오는 중 오류가 발생했습니다.
    </div>
    <div className="text-xs text-(--color-tertiary-text) mb-4">{error.message}</div>
    <button
      className="px-4 py-2 rounded bg-(--color-primary10) text-white font-semibold"
      onClick={resetErrorBoundary}
    >
      다시 시도
    </button>
  </div>
);

const GenreSection = () => {
  return (
    <div>
      <GenreCarouselTitle>영화 장르</GenreCarouselTitle>
      <AsyncBoundary
        pendingFallback={<GenreCarouselLoading />}
        FallbackComponent={GenreCarouselError}
      >
        <GenreCarousel genre="movie" />
      </AsyncBoundary>
      <GenreCarouselTitle>시리즈 장르</GenreCarouselTitle>
      <AsyncBoundary
        pendingFallback={<GenreCarouselLoading />}
        FallbackComponent={GenreCarouselError}
      >
        <GenreCarousel genre="tv" />
      </AsyncBoundary>
    </div>
  );
};

export default GenreSection;
