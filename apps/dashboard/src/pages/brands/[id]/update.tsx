import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';

import Base from 'templates/Base';
import { FormBrand } from 'templates/Brand';

type BrandUpdateProps = {
  id: string;
};

export default function ProductCategoryUpdate(props: BrandUpdateProps) {
  return (
    <Base>
      <FormBrand pageTitle="Atualize a marca" brandId={props.id} />
    </Base>
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
      id,
    },
  };
};
