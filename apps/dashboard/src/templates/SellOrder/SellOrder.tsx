import React, { FC, useState } from 'react';
import { Paginated, SellOrder } from 'interfaces/api';
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
import { FormSellOrderTemplateProps } from './SellOrder.interface';
import { DialogControlProps } from 'components/CustomDialog/CustomDialog.interface';

const SellOrderTemplate: FC<FormSellOrderTemplateProps> = ({ data }) => {
  const [page, setPage] = useState(0);
  const [dialog, setDialog] = useState<DialogControlProps>({
    isOpen: false,
  });
  const [sellOrder, setSellOrder] = useState<Paginated<SellOrder>>(data);
  const { enqueueSnackbar } = useSnackbar();

  const { isLoading } = useQuery(
    ['sellOrders', page === 0 ? 1 : page + 1],
    () => api.get(`sell-orders/?page=${page === 0 ? 1 : page + 1}`),
    {
      onSuccess: (res) => {
        setSellOrder(res.data);
      },
      keepPreviousData: true,
    },
  );

  const deleteSellOrder = useMutation<AxiosResponse, Error, string, unknown>(
    (sellOrderId) => api.delete(`/sell-orders/${sellOrderId}`),
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
      deleteSellOrder.mutate(dialog.id, {
        onSuccess: () => {
          setSellOrder((oldSellOrder) => ({
            ...oldSellOrder,
            total: oldSellOrder.total - 1,
            result: oldSellOrder.result.filter(
              (sellOrder) => sellOrder.id !== dialog.id,
            ),
          }));

          enqueueSnackbar('Venda deletada com sucesso!', {
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
        subHeader="Listagem de vendas"
        title="Vendas"
        label="Adicionar uma nova venda"
        iconRight={<AddIcon />}
        onClick={() => Router.push('/sell-orders/create')}
      />
      <Divider />
      {isLoading ? (
        <LoadingProgress />
      ) : (
        <CardContent>
          <Grid container>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              {sellOrder.result.length > 0 ? (
                <>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Descrição</TableCell>
                        <TableCell>Criado em</TableCell>
                        <TableCell>Ações</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sellOrder.result.map((sellOrder) => (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={sellOrder.id}
                        >
                          <TableCell>{sellOrder.description}</TableCell>
                          <TableCell>
                            {format(
                              parseISO(sellOrder.created_at),
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
                                    `/sell-orders/${sellOrder.id}/update`,
                                  );
                                }}
                              >
                                <EditIcon fontSize="inherit" />
                              </IconButton>
                              <IconButton
                                onClick={() =>
                                  handleOpenCustomDialog(sellOrder.id)
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
                    count={sellOrder.total}
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

export default SellOrderTemplate;
