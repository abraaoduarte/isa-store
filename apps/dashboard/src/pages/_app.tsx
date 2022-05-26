import type { AppProps } from 'next/app';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider } from 'theme';
import { Hydrate } from 'react-query/hydration';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            keepPreviousData: true,
          },
        },
      }),
  );

  return (
    <>
      <Head>
        <title>Admin - Isa Duarte Loja</title>
        <meta name="description" content="Blacktag" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <ThemeProvider>
            <Component {...pageProps} />
          </ThemeProvider>
        </Hydrate>
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
