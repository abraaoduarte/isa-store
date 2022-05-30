import React, { FC, useState } from 'react';
import { Paginated, ProductCategory } from 'interfaces/api';
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
import CircularProgress from '@mui/material/CircularProgress';
import Router from 'next/router';
import { AxiosResponse } from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import * as S from './FormProductCategory.styles';
import { useSnackbar } from 'notistack';
import CustomDialog from 'components/CustomDialog';
import AddIcon from '@mui/icons-material/Add';

type ProductCategoryTemplateProps = {
  data: Paginated<ProductCategory>;
};

type DialogProps = {
  id?: string;
  isOpen: boolean;
};

const ProductCategoryTemplate: FC<ProductCategoryTemplateProps> = ({
  data,
}) => {
  const [page, setPage] = useState(0);
  const [dialog, setDialog] = useState<DialogProps>({
    isOpen: false,
  });
  const [ProductCategories, setProductCategories] =
    useState<Paginated<ProductCategory>>(data);
  const { enqueueSnackbar } = useSnackbar();

  const { isLoading } = useQuery(
    ['ProductCategories', page === 0 ? 1 : page + 1],
    () => api.get(`product-categories/?page=${page === 0 ? 1 : page + 1}`),
    {
      onSuccess: (res) => {
        setProductCategories(res.data);
      },
      keepPreviousData: true,
    },
  );

  const deleteSize = useMutation<AxiosResponse, Error, string, unknown>(
    (sizeId) => api.delete(`/product-categories/${sizeId}`),
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
      deleteSize.mutate(dialog.id, {
        onSuccess: () => {
          setProductCategories((oldProductCategories) => ({
            ...oldProductCategories,
            total: oldProductCategories.total - 1,
            result: oldProductCategories.result.filter(
              (ProductCategory) => ProductCategory.id !== dialog.id,
            ),
          }));

          enqueueSnackbar('Categoria deletada com sucesso!', {
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
        subheader="Insira uma nova categoria"
        title="Categorias"
        action={
          <IconButton
            aria-label="Adicionar nova categoria"
            onClick={() => Router.push('/product-categories/create')}
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
              {ProductCategories.result.length > 0 ? (
                <>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Categoria</TableCell>
                        <TableCell>Criado em</TableCell>
                        <TableCell>Ações</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {ProductCategories.result.map((ProductCategory) => (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={ProductCategory.id}
                        >
                          <TableCell>{ProductCategory.name}</TableCell>
                          <TableCell>
                            {format(
                              parseISO(ProductCategory.created_at),
                              'dd/MM/yyyy',
                            )}
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
                                  Router.push(
                                    `/product-categories/${ProductCategory.id}/update`,
                                  );
                                }}
                              >
                                <EditIcon fontSize="inherit" />
                              </IconButton>
                              <IconButton
                                onClick={() =>
                                  handleOpenCustomDialog(ProductCategory.id)
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
                    count={ProductCategories.total}
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

export default ProductCategoryTemplate;
