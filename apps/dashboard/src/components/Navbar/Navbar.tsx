import { FC } from 'react';
import {
  Avatar,
  Badge,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import NotificationIcon from '@mui/icons-material/Notifications';
import * as S from './Navbar.styles';

type NavbarProps = {
  onSidebarOpen: () => void;
};

const Navbar: FC<NavbarProps> = (props) => {
  const { onSidebarOpen, ...other } = props;

  return (
    <>
      <S.StyledAppBar
        sx={{
          left: {
            lg: 280,
          },
          width: {
            lg: 'calc(100% - 280px)',
          },
        }}
        {...other}
      >
        <Toolbar
          disableGutters
          sx={{
            minHeight: 64,
            left: 0,
            px: 2,
          }}
        >
          <IconButton
            onClick={onSidebarOpen}
            sx={{
              display: {
                xs: 'inline-flex',
                lg: 'none',
              },
            }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>

          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title="Notifications">
            <IconButton sx={{ ml: 1 }}>
              <Badge badgeContent={4} color="primary">
                <NotificationIcon fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>
          <Avatar
            sx={{
              height: 40,
              width: 40,
              ml: 1,
            }}
            src="/static/images/avatars/avatar_1.png"
          >
            <PersonIcon fontSize="small" />
          </Avatar>
        </Toolbar>
      </S.StyledAppBar>
    </>
  );
};

export default Navbar;
