import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import Base from 'templates/Base';
import { FormSize } from 'templates/Size';
import { FormSizeTemplateProps } from 'templates/Size/Size.interface';

export default function SizeUpdate(props: FormSizeTemplateProps) {
  return (
    <Base>
      <FormSize {...props} pageTitle="Atualize o tamanho" />
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
      sizeId: id,
    },
  };
};
