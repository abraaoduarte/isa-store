import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { parseCookies } from 'nookies';
import Base from 'templates/Base';
import { FormColor } from 'templates/Color';
import { FormColorTemplateProps } from 'templates/Color/Color.interface';

export default function SizeUpdate(props: FormColorTemplateProps) {
  return (
    <>
      <Head>
        <title>Atualizar cor - Isa Duarte Store</title>
      </Head>
      <Base>
        <FormColor {...props} pageTitle="Atualize o nome da cor" />
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

  const id = ctx.params?.id;

  return {
    props: {
      colorId: id,
    },
  };
};
