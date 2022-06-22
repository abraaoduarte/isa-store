import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import { QueryClient } from 'react-query';
import { api } from 'services/api';
import Base from 'templates/Base';
import { FormProduct } from 'templates/Product';
import { ProductTemplateProps } from 'templates/Product/Product.interface';

export default function Index(props: ProductTemplateProps) {
  return (
    <Base>
      <FormProduct {...props} pageTitle="Adicionar produto" />
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

  const queryClient = new QueryClient();

  const brands = await queryClient.fetchQuery(
    'brands',
    () =>
      api
        .get('brands', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((result) => result.data),
    {
      staleTime: 1000,
    },
  );

  const productCategories = await queryClient.fetchQuery(
    'productCategories',
    () =>
      api
        .get('product-categories', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((result) => result.data),
    {
      staleTime: 1000,
    },
  );

  const sizes = await queryClient.fetchQuery(
    'sizes',
    () =>
      api
        .get('sizes', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((result) => result.data),
    {
      staleTime: 1000,
    },
  );

  const colors = await queryClient.fetchQuery(
    'colors',
    () =>
      api
        .get('colors', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((result) => result.data),
    {
      staleTime: 1000,
    },
  );

  return {
    props: {
      brands: brands.result,
      categories: productCategories.result,
      sizes: sizes.result,
      colors: colors.result,
    },
  };
};