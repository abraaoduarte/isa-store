import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import Home from 'templates/Home';

export default function Index() {
  return <Home />;
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

  return {
    props: {},
  };
};
