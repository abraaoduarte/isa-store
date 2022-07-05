import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { parseCookies } from 'nookies';
import { dehydrate, QueryClient } from 'react-query';
import { api } from 'services/api';
import Base from 'templates/Base';
import SizeTemplate from 'templates/Size';
import { SizeTemplateListProps } from 'templates/Size/Size.interface';

export default function Index(props: SizeTemplateListProps) {
  return (
    <>
      <Head>
        <title>Medidas - Isa Duarte Store</title>
      </Head>
      <Base>
        <SizeTemplate data={props.data} />
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
    'sizes',
    () =>
      api
        .get('sizes/paginate', {
          withCredentials: true,
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
