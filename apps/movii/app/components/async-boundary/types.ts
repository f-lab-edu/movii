import { ComponentProps, PropsWithChildren, Suspense } from 'react';
import { ErrorBoundaryProps } from 'react-error-boundary';

export type AsyncBoundaryProps = PropsWithChildren<
  ErrorBoundaryProps & {
    pendingFallback?: ComponentProps<typeof Suspense>['fallback'];
  }
>;
