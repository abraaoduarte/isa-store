import { AppBar, AppBarProps } from '@mui/material';
import { styled } from '@mui/material/styles';

interface CustomAppBarProps extends AppBarProps {
  isOpen: boolean;
  width: number;
}

export const CustomAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'isOpen',
})<CustomAppBarProps>(({ isOpen, width, theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  borderColor: 'red',
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(isOpen && {
    marginLeft: width,
    width: `calc(101% - ${width}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));
