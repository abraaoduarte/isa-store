import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { parseCookies } from 'nookies';
import Base from 'templates/Base';
import { FormSize } from 'templates/Size';
import { FormSizeTemplateProps } from 'templates/Size/Size.interface';

export default function SizeUpdate(props: FormSizeTemplateProps) {
  return (
    <>
      <Head>
        <title>Atualizar medida - Isa Duarte Store</title>
      </Head>
      <Base>
        <FormSize {...props} pageTitle="Atualize a medida" />
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
      sizeId: id,
    },
  };
};
