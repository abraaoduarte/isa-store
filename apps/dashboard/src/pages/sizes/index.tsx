import { Paginated, Size } from 'interfaces/api';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import { dehydrate, QueryClient } from 'react-query';
import { api } from 'services/api';
import Base from 'templates/Base';
import SizeTemplate from 'templates/Size';

type SizeProps = {
  data: Paginated<Size>;
};

export default function Index(props: SizeProps) {
  return (
    <Base>
      <SizeTemplate data={props.data} />
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

  await queryClient.prefetchQuery(
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

  return {
    props: {
      data: dehydrate(queryClient).queries[0].state.data,
    },
  };
};
