import { Link, useParams } from 'react-router';

import AsyncBoundary from '@/components/async-boundary';
import Profile from '@/components/profile';
import { FALLBACK_AVATAR_IMAGE_URL, TMDB_API_POSTER_BASE_URL } from '@/constants';
import useMovieQuery from '@/features/movie/hooks/queries/use-movie-query';

const CreditsContent = ({ id }: { id: number }) => {
  const { data } = useMovieQuery({
    id,
    language: 'ko',
    appendToResponse: 'credits',
  });

  const credits = data?.credits?.cast || [];

  return (
    <ul>
      {credits.map((cast) => (
        <li key={cast.id} className="py-2">
          <Link to={`/people/${cast.id}?name=${cast.name}`}>
            <Profile>
              <Profile.Image
                src={
                  cast.profilePath
                    ? `${TMDB_API_POSTER_BASE_URL}/${cast.profilePath}`
                    : FALLBACK_AVATAR_IMAGE_URL
                }
                alt={`${cast.name}의 프로필 사진`}
              />
              <div>
                <Profile.Name>{cast.name}</Profile.Name>
                <Profile.Role>{cast.character}</Profile.Role>
              </div>
            </Profile>
          </Link>
        </li>
      ))}
    </ul>
  );
};

const Credits = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return null;
  }

  return (
    <div className="px-10">
      <h1 className="text-white text-[28px] font-bold mb-3 mt-[54px]">감독/출연</h1>
      <hr className="h-px bg-(--color-divider) mb-[18px]" />
      <AsyncBoundary fallback={<div className="text-white">Error</div>}>
        <CreditsContent id={Number(id)} />
      </AsyncBoundary>
    </div>
  );
};

export default Credits;
