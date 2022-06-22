import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';

import Base from 'templates/Base';
import { FormSize } from 'templates/Size';

type SizeUpdateProps = {
  id: string;
};

export default function SizeUpdate(props: SizeUpdateProps) {
  return (
    <Base>
      <FormSize pageTitle="Atualize o tamanho" sizeId={props.id} />
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
