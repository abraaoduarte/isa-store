import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { parseCookies } from 'nookies';
import Base from 'templates/Base';
import { FormBrand } from 'templates/Brand';

export default function Index() {
  return (
    <>
      <Head>
        <title>Inserir nova marca - Isa Duarte Store</title>
      </Head>
      <Base>
        <FormBrand pageTitle="Adicionar marca" />
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
