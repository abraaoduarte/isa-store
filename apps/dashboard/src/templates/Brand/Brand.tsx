import React, { FC, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { useMutation, useQuery } from 'react-query';
import { api } from 'services/api';
import {
  CardContent,
  Divider,
  Grid,
  Table,
  TableHead,
  TableCell,
  TablePagination,
  TableRow,
  Paper,
  TableBody,
  Stack,
  IconButton,
  Typography,
} from '@mui/material';
import Router from 'next/router';
import { AxiosResponse } from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useSnackbar } from 'notistack';
import CustomDialog from 'components/CustomDialog';
import AddIcon from '@mui/icons-material/Add';
import CardHeader from 'components/CardHeader';
import LoadingProgress from 'components/LoadingProgress';
import { DialogControlProps } from 'components/CustomDialog/CustomDialog.interface';
import { BrandTemplateProps, PaginatedBrand } from './Brand.interface';

const BrandTemplate: FC<BrandTemplateProps> = ({ data }) => {
  const [page, setPage] = useState(0);
  const [dialog, setDialog] = useState<DialogControlProps>({
    isOpen: false,
  });
  const [brands, setBrands] = useState<PaginatedBrand>(data);
  const { enqueueSnackbar } = useSnackbar();

  const { isLoading } = useQuery(
    ['brands', page === 0 ? 1 : page + 1],
    () => api.get(`brands/paginate/?page=${page === 0 ? 1 : page + 1}`),
    {
      onSuccess: (res) => {
        setBrands(res.data);
      },
      keepPreviousData: true,
    },
  );

  const deleteSize = useMutation<AxiosResponse, Error, string, unknown>(
    (brandId) => api.delete(`/brands/${brandId}`),
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
          setBrands((oldBrands) => ({
            ...oldBrands,
            total: oldBrands.total - 1,
            result: oldBrands.result.filter((brand) => brand.id !== dialog.id),
          }));

          enqueueSnackbar('Marca deletada com sucesso!', {
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
    <>
      <CardHeader
        subHeader="Listagem de marcas inseridas"
        title="Marcas"
        label="Adicionar nova marca"
        iconRight={<AddIcon />}
        onClick={() => Router.push('/brands/create')}
      />

      <Divider />
      {isLoading ? (
        <LoadingProgress />
      ) : (
        <CardContent>
          <Grid container>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              {brands.result.length > 0 ? (
                <>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Marca</TableCell>
                        <TableCell>Descrição</TableCell>
                        <TableCell>Criado em</TableCell>
                        <TableCell>Ações</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {brands.result.map((brand) => (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={brand.id}
                        >
                          <TableCell>{brand.name}</TableCell>
                          <TableCell>{brand.description}</TableCell>
                          <TableCell>
                            {format(parseISO(brand.created_at), 'dd/MM/yyyy')}
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
                                  Router.push(`/brands/${brand.id}/update`);
                                }}
                              >
                                <EditIcon fontSize="inherit" />
                              </IconButton>
                              <IconButton
                                onClick={() => handleOpenCustomDialog(brand.id)}
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
                    count={brands.total}
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
    </>
  );
};

export default BrandTemplate;
