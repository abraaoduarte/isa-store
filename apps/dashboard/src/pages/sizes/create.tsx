import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { parseCookies } from 'nookies';
import Base from 'templates/Base';
import { FormSize } from 'templates/Size';

export default function Index() {
  return (
    <>
      <Head>
        <title>Inserir nova medida - Isa Duarte Store</title>
      </Head>
      <Base>
        <FormSize pageTitle="Adicionar Medida" />
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
