import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { parseCookies } from 'nookies';
import { dehydrate, QueryClient } from 'react-query';
import { api } from 'services/api';
import Base from 'templates/Base';
import ProductTemplate from 'templates/Product';
import { ProductTemplateListProps } from 'templates/Product/Product.interface';

export default function Index(props: ProductTemplateListProps) {
  return (
    <>
      <Head>
        <title>Produtos - Isa Duarte Store</title>
      </Head>
      <Base>
        <ProductTemplate data={props.data} />
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
    'products',
    () =>
      api
        .get('products', {
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
