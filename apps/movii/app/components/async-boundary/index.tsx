import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { AsyncBoundaryProps } from '@/components/async-boundary/types';

/**
 * @see https://www.npmjs.com/package/react-error-boundary
 */
const AsyncBoundary = ({
  children,
  pendingFallback = <></>,
  ...errorBoundaryProps
}: AsyncBoundaryProps) => {
  const { reset } = useQueryErrorResetBoundary();
  return (
    <ErrorBoundary onReset={reset} {...errorBoundaryProps}>
      <Suspense fallback={pendingFallback}>{children}</Suspense>
    </ErrorBoundary>
  );
};

export default AsyncBoundary;
