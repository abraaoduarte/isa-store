import { styled } from '@mui/material/styles';
import { DrawerProps, Drawer } from '@mui/material';

interface CustomDrawerProps extends DrawerProps {
  isOpen: boolean;
  width: number;
}

export const CustomDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})<CustomDrawerProps>(({ theme, width, isOpen }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: width,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    ...(!isOpen && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9),
      },
    }),
  },
}));
