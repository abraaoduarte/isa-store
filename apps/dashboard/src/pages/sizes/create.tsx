import { Box } from '@mui/material';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import Base from 'templates/Base';
import { FormCreate } from 'templates/Size';

export default function Index() {
  return (
    <Base>
      <Box
        sx={{
          '& > :not(style)': { m: 1, width: '25ch' },
        }}
      >
        <FormCreate />
      </Box>
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

  return {
    props: {},
  };
};
