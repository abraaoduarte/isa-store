import { FC, ReactNode, useState } from 'react';
import { Box } from '@mui/material';
import Navbar from 'components/Navbar';
import Sidebar from 'components/Sidebar';
import { Container } from './Base.styles';

type BaseProps = {
  children: ReactNode;
};

const Base: FC<BaseProps> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
      <Container>
        <Box
          sx={{
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
            width: '100%',
          }}
        >
          {children}
        </Box>
      </Container>
      <Navbar onSidebarOpen={() => setSidebarOpen(true)} />
      <Sidebar onClose={() => setSidebarOpen(false)} isOpen={isSidebarOpen} />
    </>
  );
};

export default Base;
