import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { parseCookies } from 'nookies';
import { QueryClient } from 'react-query';
import { api } from 'services/api';
import Base from 'templates/Base';
import { FormSellOrder } from 'templates/SellOrder';
import { FormSellOrderTemplateProps } from 'templates/SellOrder/SellOrder.interface';

export default function Index(props: FormSellOrderTemplateProps) {
  return (
    <>
      <Head>
        <title>Inserir nova venda - Isa Duarte Store</title>
      </Head>
      <Base>
        <FormSellOrder {...props} pageTitle="Adicionar nova venda" />
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

  const products = await queryClient.fetchQuery(
    'products',
    () =>
      api
        .get('product-variations', {
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
      products: products.result,
    },
  };
};
