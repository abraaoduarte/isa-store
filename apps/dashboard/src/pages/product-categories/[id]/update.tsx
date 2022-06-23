import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { parseCookies } from 'nookies';
import Base from 'templates/Base';
import { FormProductCategory } from 'templates/ProductCategory';
import { FormProductCategoryTemplateProps } from 'templates/ProductCategory/ProductCategory.interface';

export default function ProductCategoryUpdate(
  props: FormProductCategoryTemplateProps,
) {
  return (
    <>
      <Head>
        <title>Atualizar categoria - Isa Duarte Store</title>
      </Head>
      <Base>
        <FormProductCategory {...props} pageTitle="Atualize a categoria" />
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
      productCategoryId: id,
    },
  };
};
