import { GetStaticProps } from 'next';
import Home from 'templates/Home';

export default function Index() {
  return <Home />;
}

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {},
  };
};
