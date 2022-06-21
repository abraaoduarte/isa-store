import { Card, TableRow } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledCard = styled(Card)(() => ({
  minWidth: '100%',
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));
