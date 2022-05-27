import { ListItem, Box } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, ReactNode } from 'react';
import * as S from './NavItem.styles';

type NavItemProps = {
  href: string;
  icon: ReactNode;
  title: string;
};

const NavItem: FC<NavItemProps> = (props) => {
  const { href, icon, title, ...others } = props;
  const router = useRouter();
  const active = href ? router.pathname === href : false;

  return (
    <ListItem
      disableGutters
      sx={{
        display: 'flex',
        mb: 0.5,
        py: 0,
        px: 2,
      }}
      {...others}
    >
      <Link href={href} passHref>
        <S.StyledButtom active={active} startIcon={icon} disableRipple>
          <Box sx={{ flexGrow: 1 }}>{title}</Box>
        </S.StyledButtom>
      </Link>
    </ListItem>
  );
};

export default NavItem;
