import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';

import Base from 'templates/Base';
import { FormProductCategory } from 'templates/ProductCategory';

type ProductCategoryUpdateProps = {
  id: string;
};

export default function ProductCategoryUpdate(
  props: ProductCategoryUpdateProps,
) {
  return (
    <Base>
      <FormProductCategory
        pageTitle="Atualize a categoria"
        productCategoryId={props.id}
      />
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
