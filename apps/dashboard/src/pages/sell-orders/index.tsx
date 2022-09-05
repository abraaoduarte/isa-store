import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { parseCookies } from 'nookies';
import { dehydrate, QueryClient } from 'react-query';
import { api } from 'services/api';
import Base from 'templates/Base';
import SellOrderTemplate from 'templates/SellOrder';
import { SellOrderTemplateListProps } from 'templates/SellOrder/SellOrder.interface';

export default function Index(props: SellOrderTemplateListProps) {
  return (
    <>
      <Head>
        <title>Vendas - Isa Duarte Store</title>
      </Head>
      <Base>
        <SellOrderTemplate data={props.data} />
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
    'sell-orders',
    () =>
      api
        .get('sell-orders', {
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
