import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Link, LoaderFunctionArgs, useLoaderData, useParams, useSearchParams } from 'react-router';

import AsyncBoundary from '@/components/async-boundary';
import PosterCard from '@/components/poster-card';
import useMovieCreditsQuery, {
  movieCreditsQueryOptions,
} from '@/features/people/hooks/queries/use-movie-credits-query';
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

export async function loader({ params }: LoaderFunctionArgs) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    movieCreditsQueryOptions({ personId: Number(params.id), language: 'ko' }),
  );

  return {
    dehydratedState: dehydrate(queryClient),
  };
}

const CreditsContent = ({ personId }: { personId: number }) => {
  const { data } = useMovieCreditsQuery({ personId, language: 'ko' });

  const movieData = useMemo(() => getMovies(data), [data]);

  return (
    <ul className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {movieData.map(({ id, title, posterPath }) => (
        <li key={id}>
          <Link key={id} to={`/contents/${id}`}>
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
  );
};

const People = () => {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const { dehydratedState } = useLoaderData<typeof loader>();

  if (!params.id) {
    return null;
  }

  return (
    <HydrationBoundary state={dehydratedState}>
      <main className="max-w-[1680px] mx-auto">
        <section className="px-(--page-side-margin) pt-[54px]">
          <h1 className="text-white font-bold text-[28px]">{searchParams.get('name')}</h1>
        </section>
        <section className="px-(--page-side-margin) mt-8">
          <AsyncBoundary fallback={<div className="text-white">Error</div>}>
            <CreditsContent personId={Number(params.id)} />
          </AsyncBoundary>
        </section>
      </main>
    </HydrationBoundary>
  );
};

export default People;
