import { ComponentProps, memo } from 'react';

import TmdbImage from '@/components/tmdb-image';
import { cn } from '@/utils/cn';

type PosterCardProps = ComponentProps<'div'> & {
  title: string;
  imagePath: string;
  width: number;
  height: number;
  kind?: 'poster' | 'backdrop';
};

const PosterCard = ({
  title,
  imagePath,
  width,
  height,
  kind = 'poster',
  className,
  ...props
}: PosterCardProps) => {
  return (
    <div {...props} className={cn('overflow-hidden cursor-pointer rounded', className)}>
      <TmdbImage
        kind={kind}
        path={imagePath}
        alt={title}
        width={width}
        height={height}
        className="size-full object-cover bg-(--color-background30)"
      />
    </div>
  );
};

export default memo(PosterCard);
