import { Paginated, Color } from 'interfaces/api';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import { dehydrate, QueryClient } from 'react-query';
import { api } from 'services/api';
import Base from 'templates/Base';
import ColorTemplate from 'templates/Color';

type ColorProps = {
  data: Paginated<Color>;
};

export default function Index(props: ColorProps) {
  return (
    <Base>
      <ColorTemplate data={props.data} />
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
      data: dehydrate(queryClient).queries[0].state.data,
    },
  };
};
