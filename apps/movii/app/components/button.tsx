import { ComponentProps } from 'react';

import { cn } from '@/utils/cn';

type ButtonProps = ComponentProps<'button'> & {
  priority?: 'primary' | 'secondary' | 'tertiary';
};

// TODO. size prop 추가 고려
const Button = ({
  children,
  type = 'button',
  priority = 'primary',
  className,
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      type={type}
      className={cn(
        'text-white rounded text-[15px]',
        {
          'bg-(--color-primary10) hover:bg-(--color-primary40)': priority === 'primary',
          'bg-(--color-opacity15) hover:bg-(--color-opacity30)': priority === 'secondary',
          'bg-(--color-black-opacity30) hover:bg-(--color-black-opacity10)':
            priority === 'tertiary',
        },
        className,
      )}
    >
      {children}
    </button>
  );
};

export default Button;
