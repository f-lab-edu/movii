import Link from 'next/link';
import { useRouter } from 'next/router';

import AsyncBoundary from '@/components/async-boundary';
import Meta from '@/components/meta';
import Profile from '@/components/profile';
import { FALLBACK_AVATAR_IMAGE_URL } from '@/constants';
import useMovieQuery from '@/features/movie/hooks/queries/use-movie-query';

const Credits = ({ id }: { id: number }) => {
  const { data } = useMovieQuery({
    id,
    language: 'ko',
    appendToResponse: 'credits',
  });

  const credits = data?.credits?.cast || [];

  return (
    <>
      <Meta title={`${data.title} - 감독/출연`} />
      <ul>
        {credits.map((cast) => (
          <li key={cast.id} className="py-2">
            <Link href={`/people/${cast.id}?name=${cast.name}`}>
              <Profile>
                <Profile.Image
                  path={cast.profilePath ?? FALLBACK_AVATAR_IMAGE_URL}
                  alt={`${cast.name}의 프로필 사진`}
                  width={62}
                  height={62}
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
    </>
  );
};

const ContentsCredits = () => {
  const router = useRouter();
  const id = router.query.id as string;

  return (
    <div className="px-10">
      <h1 className="text-white text-[28px] font-bold mb-3 mt-[54px]">감독/출연</h1>
      <hr className="h-px bg-(--color-divider) mb-[18px]" />
      {id && (
        <AsyncBoundary fallback={<div className="text-white">Error</div>}>
          <Credits id={Number(id)} />
        </AsyncBoundary>
      )}
    </div>
  );
};

export default ContentsCredits;
