import { FC, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Divider,
  Drawer,
  ThemeOptions,
  useMediaQuery,
  Typography,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import CategoryIcon from '@mui/icons-material/Category';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import GridViewIcon from '@mui/icons-material/GridView';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SellIcon from '@mui/icons-material/Sell';
import NavItem from 'components/NavItem/NavItem';

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const Sidebar: FC<SidebarProps> = (props) => {
  const { isOpen, onClose } = props;
  const router = useRouter();
  const lgUp = useMediaQuery(
    (theme: ThemeOptions) =>
      theme.breakpoints?.up ? theme.breakpoints.up('lg') : '',
    {
      defaultMatches: true,
      noSsr: false,
    },
  );

  useEffect(
    () => {
      if (!router.isReady) {
        return;
      }

      if (isOpen) {
        onClose?.();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.asPath],
  );

  const content = (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography
            color="inherit"
            variant="subtitle1"
            sx={{ textAlign: 'center' }}
          >
            ISA DUARTE STORE
          </Typography>
        </Box>
        <Divider
          sx={{
            borderColor: '#2D3748',
            my: 3,
            marginTop: 0,
          }}
        />
        <Box sx={{ flexGrow: 1 }}>
          <NavItem title="Home" icon={<OpenInNewIcon />} href="/" />
          <Divider sx={{ borderColor: '#2D3748' }} />
          <Box
            sx={{
              px: 2,
              py: 3,
            }}
          >
            <Typography color="neutral.100" variant="subtitle2">
              Produtos
            </Typography>
          </Box>
          <NavItem title="Medidas" icon={<SquareFootIcon />} href="/sizes" />
          <NavItem
            title="Categorias"
            icon={<CategoryIcon />}
            href="/product-categories"
          />
          <NavItem title="Cores" icon={<ColorLensIcon />} href="/colors" />
          <NavItem title="Marcas" icon={<GridViewIcon />} href="/brands" />
          <NavItem title="Produtos" icon={<CheckroomIcon />} href="/products" />
          <Divider sx={{ borderColor: '#2D3748' }} />
          <Box
            sx={{
              px: 2,
              py: 3,
            }}
          >
            <Typography color="neutral.100" variant="subtitle2">
              Contas
            </Typography>
          </Box>
          <NavItem
            title="Categorias"
            icon={<CategoryIcon />}
            href="/ledger-categories"
          />
          <NavItem
            title="Movimentações"
            icon={<AccountBalanceIcon />}
            href="/ledger"
          />
          <Divider sx={{ borderColor: '#2D3748' }} />
          <Box
            sx={{
              px: 2,
              py: 3,
            }}
          >
            <Typography color="neutral.100" variant="subtitle2">
              Vendas
            </Typography>
            <NavItem title="Vendas" icon={<SellIcon />} href="/sell-orders" />
          </Box>
        </Box>
      </Box>
    </>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: 'neutral.900',
            color: '#FFFFFF',
            width: 280,
          },
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={isOpen}
      PaperProps={{
        sx: {
          backgroundColor: 'neutral.900',
          color: '#FFFFFF',
          width: 280,
        },
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

export default Sidebar;
