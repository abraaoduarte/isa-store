import { styled } from '@mui/material/styles';
import { ButtonProps, Button } from '@mui/material';

interface CustomButtonProps extends ButtonProps {
  active: boolean;
}

export const StyledButtom = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'active',
})<CustomButtonProps>(({ theme, active }) => ({
  color: theme.palette.neutral['300'],
  borderRadius: 1,
  justifyContent: 'flex-start',
  px: 3,
  textAlign: 'left',
  textTransform: 'none',
  width: '100%',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255, 0.08)',
  },
  '& .MuiButton-startIcon': {
    color: theme.palette.neutral['400'],
  },
  ...(active && {
    backgroundColor: 'rgba(255,255,255, 0.08)',
    color: theme.palette.secondary.main,
    fontWeight: 'bold',
    '& .MuiButton-startIcon': {
      color: theme.palette.secondary.main,
    },
  }),
}));
