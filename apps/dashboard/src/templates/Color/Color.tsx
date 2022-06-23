import React, { FC, useState } from 'react';
import { Paginated, Color } from 'interfaces/api';
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
import { DialogControlProps } from 'components/CustomDialog/CustomDialog.interface';
import { ColorTemplateListProps } from './Color.interface';
import CardHeader from 'components/CardHeader';
import LoadingProgress from 'components/LoadingProgress';

const Color: FC<ColorTemplateListProps> = ({ data }) => {
  const [page, setPage] = useState(0);
  const [dialog, setDialog] = useState<DialogControlProps>({
    isOpen: false,
  });
  const [color, setcolors] = useState<Paginated<Color>>(data);
  const { enqueueSnackbar } = useSnackbar();

  const { isLoading } = useQuery(
    ['color', page === 0 ? 1 : page + 1],
    () => api.get(`colors/paginate/?page=${page === 0 ? 1 : page + 1}`),
    {
      onSuccess: (res) => {
        setcolors(res.data);
      },
      keepPreviousData: true,
    },
  );

  const deleteSize = useMutation<AxiosResponse, Error, string, unknown>(
    (colorId) => api.delete(`/colors/${colorId}`),
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
          setcolors((oldColors) => ({
            ...oldColors,
            total: oldColors.total - 1,
            result: oldColors.result.filter((color) => color.id !== dialog.id),
          }));

          enqueueSnackbar('Cor deletada com sucesso!', {
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
        subHeader="Listagem de cores inseridas"
        title="Cores"
        label="Adicionar uma nova cor"
        iconRight={<AddIcon />}
        onClick={() => Router.push('/colors/create')}
      />

      <Divider />
      {isLoading ? (
        <LoadingProgress />
      ) : (
        <CardContent>
          <Grid container>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              {color.result.length > 0 ? (
                <>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Cor</TableCell>
                        <TableCell>Criado em</TableCell>
                        <TableCell>Ações</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {color.result.map((Color) => (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={Color.id}
                        >
                          <TableCell>{Color.name}</TableCell>
                          <TableCell>
                            {format(parseISO(Color.created_at), 'dd/MM/yyyy')}
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
                                  Router.push(`/colors/${Color.id}/update`);
                                }}
                              >
                                <EditIcon fontSize="inherit" />
                              </IconButton>
                              <IconButton
                                onClick={() => handleOpenCustomDialog(Color.id)}
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
                    count={color.total}
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

export default Color;
