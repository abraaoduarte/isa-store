import { useState } from 'react';
import { Box, Container, Grid, Paper, Toolbar } from '@mui/material';
import Content from 'components/Content';
import Footer from 'components/Footer/Footer';
import Navbar from 'components/Navbar';
import Sidebar from 'components/Sidebar';
import { Copyright } from '@mui/icons-material';

const DRAWER_WIDTH = 280;

const Base = () => {
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  const handleMenu = () => {
    setIsOpenMenu((value) => !value);
  };
  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar
        width={DRAWER_WIDTH}
        handleMenu={handleMenu}
        isOpen={isOpenMenu}
      />
      <Sidebar
        handleMenu={handleMenu}
        isOpen={isOpenMenu}
        width={DRAWER_WIDTH}
      />
      <Box
        component="main"
        sx={{
          paddingTop: '64px',
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Container maxWidth="lg">
          <h1>Dashboard</h1>
        </Container>
        <Box>
          <Footer />
        </Box>
      </Box>
    </Box>
  );
};

export default Base;
