import { FallbackProps } from 'react-error-boundary';

import Button from '@/components/button';

const ResultError = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <div className="flex flex-col items-center justify-center mt-10 gap-2 text-(--color-tertiary-text)">
      <p>검색 결과를 불러오는 중에 오류가 발생했습니다.</p>
      {error.message && <p>Error Message: {error.message}</p>}
      <Button priority="secondary" onClick={resetErrorBoundary} className="p-2">
        다시 시도하기
      </Button>
    </div>
  );
};

export default ResultError;
