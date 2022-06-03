import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';

import Base from 'templates/Base';
import { FormColor } from 'templates/Color';

type SizeUpdateProps = {
  id: string;
};

export default function SizeUpdate(props: SizeUpdateProps) {
  return (
    <Base>
      <FormColor pageTitle="Atualize a cor" colorId={props.id} />
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

  // const queryClient = new QueryClient();

  // await queryClient.prefetchQuery(
  //   ['size', id],
  //   () =>
  //     api
  //       .get(`sizes/${id}`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })
  //       .then((result) => result.data),
  //   {
  //     staleTime: 1000,
  //   },
  // );

  return {
    props: {
      id,
      // size: dehydrate(queryClient),
    },
  };
};
