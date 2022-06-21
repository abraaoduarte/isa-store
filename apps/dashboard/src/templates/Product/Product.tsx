import React, { FC, useState } from 'react';
import { Paginated, Product } from 'interfaces/api';
import { format, parseISO } from 'date-fns';
import { useMutation, useQuery } from 'react-query';
import { api } from 'services/api';
import {
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Table,
  TableHead,
  TableCell,
  TablePagination,
  TableRow,
  Paper,
  TableBody,
  Box,
  Stack,
  IconButton,
  Typography,
} from '@mui/material';
import { BRL } from '@dinero.js/currencies';
import CircularProgress from '@mui/material/CircularProgress';
import Router from 'next/router';
import { AxiosResponse } from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import * as S from './FormProduct.styles';
import { useSnackbar } from 'notistack';
import CustomDialog from 'components/CustomDialog';
import AddIcon from '@mui/icons-material/Add';
import { dinero, down, toUnit } from 'dinero.js';

type ProductTemplateProps = {
  data: Paginated<Product>;
};

type DialogProps = {
  id?: string;
  isOpen: boolean;
};

const formatNumberToDecimal = (number: number) => {
  const price = dinero({ amount: number, currency: BRL });
  const priceDecimal: number = toUnit(price, { digits: 2, round: down });
  return priceDecimal.toLocaleString('pt-br', { minimumFractionDigits: 2 });
};

const ProductTemplate: FC<ProductTemplateProps> = ({ data }) => {
  const [page, setPage] = useState(0);
  const [dialog, setDialog] = useState<DialogProps>({
    isOpen: false,
  });
  const [products, setProducts] = useState<Paginated<Product>>(data);
  const { enqueueSnackbar } = useSnackbar();

  const { isLoading } = useQuery(
    ['products', page === 0 ? 1 : page + 1],
    () => api.get(`products/?page=${page === 0 ? 1 : page + 1}`),
    {
      onSuccess: (res) => {
        setProducts(res.data);
      },
      keepPreviousData: true,
    },
  );

  const deleteProduct = useMutation<AxiosResponse, Error, string, unknown>(
    (productId) => api.delete(`/products/${productId}`),
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleOpenCustomDialog = (id: string) => {
    setDialog({
      isOpen: true,
      id,
    });
  };

  const handleCloseCustomDialog = () => {
    setDialog({
      isOpen: false,
      id: undefined,
    });
  };

  const handleDelete = () => {
    if (dialog.id) {
      deleteProduct.mutate(dialog.id, {
        onSuccess: () => {
          setProducts((oldBrands) => ({
            ...oldBrands,
            total: oldBrands.total - 1,
            result: oldBrands.result.filter(
              (product) => product.id !== dialog.id,
            ),
          }));

          enqueueSnackbar('Produto deletada com sucesso!', {
            variant: 'success',
          });
        },
        onError: (error) => {
          enqueueSnackbar(error.message, {
            variant: 'error',
          });
        },
      });
    }
    setDialog({
      id: undefined,
      isOpen: false,
    });
  };

  return (
    <S.StyledCard>
      <CardHeader
        subheader="Insira uma nova produto"
        title="Marcas"
        action={
          <IconButton
            aria-label="Adicionar nova produto"
            onClick={() => Router.push('/products/create')}
          >
            <AddIcon />
          </IconButton>
        }
      />
      <Divider />
      {isLoading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <CardContent>
          <Grid container spacing={4}>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              {products.result.length > 0 ? (
                <>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Produto</TableCell>
                        <TableCell>Descrição</TableCell>
                        <TableCell>Preço</TableCell>
                        <TableCell>Criado em</TableCell>
                        <TableCell>Ações</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {products.result.map((product) => (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={product.id}
                        >
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{product.description}</TableCell>
                          <TableCell>
                            {formatNumberToDecimal(product.price)}
                          </TableCell>
                          <TableCell>
                            {format(parseISO(product.created_at), 'dd/MM/yyyy')}
                          </TableCell>
                          <TableCell width={100}>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
                              <IconButton
                                aria-label="delete"
                                color="default"
                                size="small"
                                onClick={() => {
                                  Router.push(`/products/${product.id}/update`);
                                }}
                              >
                                <EditIcon fontSize="inherit" />
                              </IconButton>
                              <IconButton
                                onClick={() =>
                                  handleOpenCustomDialog(product.id)
                                }
                                aria-label="delete"
                                color="error"
                                size="small"
                              >
                                <DeleteIcon fontSize="inherit" />
                              </IconButton>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <TablePagination
                    rowsPerPageOptions={[]}
                    component="div"
                    count={products.total}
                    rowsPerPage={10}
                    page={page}
                    showFirstButton
                    showLastButton
                    onPageChange={handleChangePage}
                  />
                </>
              ) : (
                <Typography
                  variant="h6"
                  align="center"
                  gutterBottom
                  component="h6"
                  mt={1}
                >
                  Nenhum dado encontrado
                </Typography>
              )}
            </Paper>
          </Grid>
          <CustomDialog
            title="Tem certeza que deseja deletar?"
            message="Após deletado, esse dado não poderá ser recuperado"
            open={dialog.isOpen}
            onConfirm={handleDelete}
            onClose={handleCloseCustomDialog}
          />
        </CardContent>
      )}
    </S.StyledCard>
  );
};

export default ProductTemplate;
