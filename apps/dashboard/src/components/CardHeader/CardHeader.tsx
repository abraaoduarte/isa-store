import { FC } from 'react';
import {
  IconButton,
  CardHeader as MUICardHeader,
  Divider,
} from '@mui/material';
import { CardHeaderProps } from './CardHeader.interface';

const CardHeader: FC<CardHeaderProps> = ({
  subHeader,
  title,
  label,
  onClick,
  iconRight,
}) => {
  const actionHeader = {
    action: onClick && label && iconRight && (
      <IconButton aria-label={label} onClick={onClick}>
        {iconRight}
      </IconButton>
    ),
  };
  return (
    <>
      <MUICardHeader subheader={subHeader} title={title} {...actionHeader} />
      <Divider />
    </>
  );
};

export default CardHeader;
