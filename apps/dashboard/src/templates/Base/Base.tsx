import { FC, ReactNode, useState } from 'react';
import { Box } from '@mui/material';
import Navbar from 'components/Navbar';
import Sidebar from 'components/Sidebar';
import * as S from './Base.styles';

type BaseProps = {
  children: ReactNode;
};

const Base: FC<BaseProps> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
      <S.Container>
        <Box
          sx={{
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
            width: '100%',
            overflow: 'hidden',
            padding: '16px',
          }}
        >
          <S.StyledCard>{children}</S.StyledCard>
        </Box>
      </S.Container>
      <Navbar onSidebarOpen={() => setSidebarOpen(true)} />
      <Sidebar onClose={() => setSidebarOpen(false)} isOpen={isSidebarOpen} />
    </>
  );
};

export default Base;
