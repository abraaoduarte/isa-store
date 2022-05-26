import { Typography } from '@mui/material';
import Link from 'next/link';

const Footer = () => {
  return (
    <Typography variant="body2" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Isa Duarte Store
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
};

export default Footer;
