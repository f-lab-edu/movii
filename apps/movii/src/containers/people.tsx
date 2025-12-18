import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

import AsyncBoundary from '@/components/async-boundary';
import Meta from '@/components/meta';
import PosterCard from '@/components/poster-card';
import useMovieCreditsQuery from '@/features/people/hooks/queries/use-movie-credits-query';
import { MovieCreditsResponse } from '@/features/people/types';

const extractCreditData = (data: MovieCreditsResponse, type: 'cast' | 'crew') =>
  data[type].map(({ id, title, posterPath }) => ({ id, title, posterPath }));

const getMovies = (data: MovieCreditsResponse) => {
  const casts = extractCreditData(data, 'cast');
  const crews = extractCreditData(data, 'crew');
  const allMovies = casts.concat(crews).filter((movie) => !!movie.posterPath);

  // 중복 id 제거
  const movieData = allMovies.filter(
    (movie, index, arr) => arr.findIndex((m) => m.id === movie.id) === index,
  );

  return movieData;
};

const CreditsContent = ({ personId }: { personId: number }) => {
  const router = useRouter();
  const { data } = useMovieCreditsQuery({ personId, language: 'ko' });

  const movieData = useMemo(() => getMovies(data), [data]);

  return (
    <>
      <Meta title={`${router.query.name}의 출연작`} />
      <ul className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {movieData.map(({ id, title, posterPath }) => (
          <li key={id}>
            <Link key={id} href={`/contents/${id}`}>
              <PosterCard
                title={title}
                imagePath={posterPath}
                className="aspect-2/3 hover:brightness-80"
                width={190}
                height={285}
              />
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

const People = () => {
  const router = useRouter();

  return (
    <main className="max-w-[1680px] mx-auto">
      <section className="px-(--page-side-margin) pt-[54px]">
        {router.query.name && (
          <h1 className="text-white font-bold text-[28px]">{router.query.name}</h1>
        )}
      </section>
      <section className="px-(--page-side-margin) mt-8">
        {router.query.id && (
          <AsyncBoundary fallback={<div className="text-white">Error</div>}>
            <CreditsContent personId={Number(router.query.id)} />
          </AsyncBoundary>
        )}
      </section>
    </main>
  );
};

export default People;
