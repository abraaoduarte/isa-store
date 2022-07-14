import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { parseCookies } from 'nookies';
import { QueryClient } from 'react-query';
import { api } from 'services/api';
import Base from 'templates/Base';
import { FormLedger } from 'templates/Ledger';
import { FormLedgerTemplateProps } from 'templates/Ledger/Ledger.interface';

export default function Index(props: FormLedgerTemplateProps) {
  return (
    <>
      <Head>
        <title>Inserir nova movimentação - Isa Duarte Store</title>
      </Head>
      <Base>
        <FormLedger {...props} pageTitle="Adicionar nova movimentação" />
      </Base>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ['token']: token } = parseCookies(ctx);

  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const queryClient = new QueryClient();

  const ledgerCategories = await queryClient.fetchQuery(
    'ledgerCategories',
    () =>
      api
        .get('ledger-categories', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((result) => result.data),
    {
      staleTime: 1000,
    },
  );

  return {
    props: {
      categories: ledgerCategories.result,
    },
  };
};
