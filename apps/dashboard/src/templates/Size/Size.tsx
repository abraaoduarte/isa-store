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
} from '@mui/material';
import Router from 'next/router';
import { AxiosResponse } from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useSnackbar } from 'notistack';
import CustomDialog from 'components/CustomDialog';
import AddIcon from '@mui/icons-material/Add';
import { PaginatedSize, SizeTemplateListProps } from './Size.interface';
import { DialogControlProps } from 'components/CustomDialog/CustomDialog.interface';
import CardHeader from 'components/CardHeader';
import LoadingProgress from 'components/LoadingProgress';

const SizeTemplate: FC<SizeTemplateListProps> = ({ data }) => {
  const [page, setPage] = useState(0);
  const [dialog, setDialog] = useState<DialogControlProps>({
    isOpen: false,
  });
  const [sizes, setSizes] = useState<PaginatedSize>(data);
  const { enqueueSnackbar } = useSnackbar();

  const { isLoading } = useQuery(
    ['sizes', page === 0 ? 1 : page + 1],
    () => api.get(`sizes/paginate/?page=${page === 0 ? 1 : page + 1}`),
    {
      onSuccess: (res) => {
        setSizes(res.data);
      },
      keepPreviousData: true,
    },
  );

  const deleteSize = useMutation<AxiosResponse, Error, string, unknown>(
    (sizeId) => api.delete(`/sizes/${sizeId}`),
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
          setSizes((oldSizes) => ({
            ...oldSizes,
            total: oldSizes.total - 1,
            result: oldSizes.result.filter((size) => size.id !== dialog.id),
          }));

          enqueueSnackbar('Medida deletada com sucesso!', {
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
        subHeader="Listagem de medidas inseridas"
        title="Medidas"
        label="Adicionar nova medida"
        iconRight={<AddIcon />}
        onClick={() => Router.push('/sizes/create')}
      />
      <Divider />
      {isLoading ? (
        <LoadingProgress />
      ) : (
        <CardContent>
          <Grid container>
            <Paper
              sx={{
                width: '100%',
                overflow: 'hidden',
              }}
            >
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell>Medida</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Criado em</TableCell>
                    <TableCell>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sizes.result.map((size) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={size.id}>
                      <TableCell>{size.size}</TableCell>
                      <TableCell>{size.type}</TableCell>
                      <TableCell>
                        {format(parseISO(size.created_at), 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell width={100}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <IconButton
                            aria-label="delete"
                            color="default"
                            size="small"
                            onClick={() => {
                              Router.push(`/sizes/${size.id}/update`);
                            }}
                          >
                            <EditIcon fontSize="inherit" />
                          </IconButton>
                          <IconButton
                            onClick={() => handleOpenCustomDialog(size.id)}
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
                count={sizes.total}
                rowsPerPage={10}
                page={page}
                showFirstButton
                showLastButton
                onPageChange={handleChangePage}
              />
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

export default SizeTemplate;
