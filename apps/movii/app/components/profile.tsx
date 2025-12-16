import { ComponentProps } from 'react';

import TmdbImage from '@/components/tmdb-image';
import { cn } from '@/utils/cn';

const Profile = ({ children, className, ...props }: ComponentProps<'div'>) => {
  return (
    <div {...props} className={cn('flex items-center gap-3.5', className)}>
      {children}
    </div>
  );
};

const ProfileImage = ({
  path,
  alt,
  width,
  height,
  className,
  ...props
}: Omit<ComponentProps<typeof TmdbImage>, 'kind'>) => {
  return (
    <TmdbImage
      {...props}
      kind="profile"
      path={path}
      alt={alt}
      width={width}
      height={height}
      className={cn('size-[62px] rounded-full object-cover bg-(--color-background30)', className)}
    />
  );
};

const ProfileName = ({ children, className, ...props }: ComponentProps<'div'>) => {
  return (
    <div {...props} className={cn('text-white', className)}>
      {children}
    </div>
  );
};

const ProfileRole = ({ children, className, ...props }: ComponentProps<'div'>) => {
  return (
    <div {...props} className={cn('text-(--color-tertiary-text) text-[13px]', className)}>
      {children}
    </div>
  );
};

Profile.Image = ProfileImage;
Profile.Name = ProfileName;
Profile.Role = ProfileRole;

export default Profile;
