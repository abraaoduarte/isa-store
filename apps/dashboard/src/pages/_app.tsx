import type { AppProps } from 'next/app';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider } from 'theme';
import { Hydrate } from 'react-query/hydration';
import Head from 'next/head';
import { AuthProvider } from 'contexts/AuthContext';
import { SnackbarProvider } from 'notistack';

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
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Blacktag" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <ThemeProvider>
              <SnackbarProvider maxSnack={3}>
                <Component {...pageProps} />
              </SnackbarProvider>
            </ThemeProvider>
          </Hydrate>
        </QueryClientProvider>
      </AuthProvider>
    </>
  );
}

export default MyApp;
