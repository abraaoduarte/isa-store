import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { parseCookies } from 'nookies';
import { dehydrate, QueryClient } from 'react-query';
import { api } from 'services/api';
import Base from 'templates/Base';
import LedgerCategoryTemplate from 'templates/LedgerCategory';
import { LedgerCategoryTemplateListProps } from 'templates/LedgerCategory/LedgerCategory.interface';

export default function Index(props: LedgerCategoryTemplateListProps) {
  return (
    <>
      <Head>
        <title>Categoria das Contas - Isa Duarte Store</title>
      </Head>
      <Base>
        <LedgerCategoryTemplate data={props.data} />
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

  await queryClient.prefetchQuery(
    'ledgerCategories',
    () =>
      api
        .get('ledger-categories/paginate', {
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
      data: dehydrate(queryClient).queries[0].state.data,
    },
  };
};
