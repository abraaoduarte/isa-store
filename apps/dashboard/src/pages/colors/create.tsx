import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { parseCookies } from 'nookies';
import Base from 'templates/Base';
import { FormColor } from 'templates/Color';

export default function Index() {
  return (
    <>
      <Head>
        <title>Inserir nova cor - Isa Duarte Store</title>
      </Head>
      <Base>
        <FormColor pageTitle="Adicionar uma nova Cor" />
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
