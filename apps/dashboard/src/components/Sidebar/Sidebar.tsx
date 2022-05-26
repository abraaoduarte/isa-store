import { FC } from 'react';
import {
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { SidebarProps } from './Sidebar.interface';
import { CustomDrawer } from './Sidebar.styles';

const Sidebar: FC<SidebarProps> = ({
  handleMenu,
  isOpen = false,
  width = 280,
}) => {
  return (
    <CustomDrawer width={width} variant="permanent" isOpen={isOpen}>
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          backgroundColor: 'primary.main',
          px: [1],
        }}
      >
        <Typography
          sx={{
            color: 'white',
            textAlign: 'center',
            width: '100%',
          }}
        >
          ISA DUARTE
        </Typography>
        <IconButton sx={{ color: 'white' }} onClick={handleMenu}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List component="nav">
        <ListItemButton>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
      </List>
    </CustomDrawer>
  );
};

export default Sidebar;
