import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import Base from 'templates/Base';
import { FormColor } from 'templates/Color';
import { FormColorTemplateProps } from 'templates/Color/Color.interface';

export default function SizeUpdate(props: FormColorTemplateProps) {
  return (
    <Base>
      <FormColor {...props} pageTitle="Atualize o nome da cor" />
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
      colorId: id,
    },
  };
};
