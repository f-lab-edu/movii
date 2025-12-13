import { ComponentProps, memo } from 'react';

import { cn } from '@/utils/cn';

type PosterCardProps = ComponentProps<'div'> & {
  title: string;
  imageUrl: string;
};

const PosterCard = ({ title, imageUrl, className, ...props }: PosterCardProps) => {
  return (
    <div {...props} className={cn('overflow-hidden cursor-pointer rounded', className)}>
      <img
        src={imageUrl}
        alt={title}
        loading="lazy"
        className="size-full object-cover bg-(--color-background30)"
      />
    </div>
  );
};

export default memo(PosterCard);
