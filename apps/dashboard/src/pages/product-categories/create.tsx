import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { parseCookies } from 'nookies';
import Base from 'templates/Base';
import { FormProductCategory } from 'templates/ProductCategory';

export default function Index() {
  return (
    <>
      <Head>
        <title>Inserir nova categoria - Isa Duarte Store</title>
      </Head>
      <Base>
        <FormProductCategory pageTitle="Adicionar uma nova categoria" />
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

  return {
    props: {},
  };
};
