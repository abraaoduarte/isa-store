import { styled } from '@mui/material/styles';
import { Card } from '@mui/material';

export const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  maxWidth: '100%',
  paddingTop: 64,
  [theme.breakpoints.up('lg')]: {
    paddingLeft: 280,
  },
}));

export const StyledCard = styled(Card)(() => ({
  minWidth: '100%',
}));
