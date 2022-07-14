import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { parseCookies } from 'nookies';
import Base from 'templates/Base';
import { FormLedgerCategory } from 'templates/LedgerCategory';
import { FormLedgerCategoryTemplateProps } from 'templates/LedgerCategory/LedgerCategory.interface';

export default function LedgerCategoryUpdate(
  props: FormLedgerCategoryTemplateProps,
) {
  return (
    <>
      <Head>
        <title>Atualizar categoria - Isa Duarte Store</title>
      </Head>
      <Base>
        <FormLedgerCategory {...props} pageTitle="Atualize a categoria" />
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
      ledgerCategoryId: id,
    },
  };
};
