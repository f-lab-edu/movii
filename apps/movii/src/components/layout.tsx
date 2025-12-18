import { ReactNode } from 'react';
import { FallbackProps } from 'react-error-boundary';

import AsyncBoundary from '@/components/async-boundary';
import Button from '@/components/button';
import Header from '@/components/header';

const RejectedFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-96 gap-2">
      <p className="text-(--color-background100)">에러가 발생했습니다: {error.message}</p>
      <Button onClick={resetErrorBoundary} className="mt-4 px-4 py-2 text-white rounded">
        다시 시도
      </Button>
    </div>
  );
};

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header />
      <AsyncBoundary FallbackComponent={RejectedFallback}>{children}</AsyncBoundary>
    </>
  );
};

export default Layout;
