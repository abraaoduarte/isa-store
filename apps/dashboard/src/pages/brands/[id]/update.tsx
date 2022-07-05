import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { parseCookies } from 'nookies';
import Base from 'templates/Base';
import { FormBrand } from 'templates/Brand';
import { FormBrandTemplateProps } from 'templates/Brand/Brand.interface';

export default function ProductCategoryUpdate(props: FormBrandTemplateProps) {
  return (
    <>
      <Head>
        <title>Atualizar marca - Isa Duarte Store</title>
      </Head>
      <Base>
        <FormBrand {...props} pageTitle="Atualize a marca" />
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
      brandId: id,
    },
  };
};
