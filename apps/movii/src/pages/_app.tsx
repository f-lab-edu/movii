import {
  type DehydratedState,
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { useState } from 'react';

import TanstackQueryDevtools from '@/add-ons/tanstack-query-devtools';
import Layout from '@/components/layout';
import '@/styles/global.css';

import type { AppProps } from 'next/app';

type Props = AppProps<{
  dehydratedState?: DehydratedState;
}>;

export default function App({ Component, pageProps }: Props) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={pageProps.dehydratedState}>
        <Layout>
          <Component {...pageProps} />
          {process.env.NODE_ENV === 'development' ? <TanstackQueryDevtools /> : null}
        </Layout>
      </HydrationBoundary>
    </QueryClientProvider>
  );
}
