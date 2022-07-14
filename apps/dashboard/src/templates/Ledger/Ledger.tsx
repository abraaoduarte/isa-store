import React, { FC, useState } from 'react';
import { Paginated, Ledger } from 'interfaces/api';
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
import { LedgerTemplateListProps } from './Ledger.interface';
import { DialogControlProps } from 'components/CustomDialog/CustomDialog.interface';

const LedgerTemplate: FC<LedgerTemplateListProps> = ({ data }) => {
  const [page, setPage] = useState(0);
  const [dialog, setDialog] = useState<DialogControlProps>({
    isOpen: false,
  });
  const [ledger, setLedger] = useState<Paginated<Ledger>>(data);
  const { enqueueSnackbar } = useSnackbar();

  const { isLoading } = useQuery(
    ['ledger', page === 0 ? 1 : page + 1],
    () => api.get(`ledger/?page=${page === 0 ? 1 : page + 1}`),
    {
      onSuccess: (res) => {
        setLedger(res.data);
      },
      keepPreviousData: true,
    },
  );

  const deleteLedger = useMutation<AxiosResponse, Error, string, unknown>(
    (ledgerId) => api.delete(`/ledger/${ledgerId}`),
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
      deleteLedger.mutate(dialog.id, {
        onSuccess: () => {
          setLedger((oldLedger) => ({
            ...oldLedger,
            total: oldLedger.total - 1,
            result: oldLedger.result.filter(
              (ledger) => ledger.id !== dialog.id,
            ),
          }));

          enqueueSnackbar('Movimentação deletada com sucesso!', {
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
        subHeader="Listagem de movimentações"
        title="Movimentações"
        label="Adicionar uma nova movimentação"
        iconRight={<AddIcon />}
        onClick={() => Router.push('/ledger/create')}
      />
      <Divider />
      {isLoading ? (
        <LoadingProgress />
      ) : (
        <CardContent>
          <Grid container>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              {ledger.result.length > 0 ? (
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
                      {ledger.result.map((ledger) => (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={ledger.id}
                        >
                          <TableCell>{ledger.description}</TableCell>
                          <TableCell>
                            {format(parseISO(ledger.created_at), 'dd/MM/yyyy')}
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
                                  Router.push(`/ledger/${ledger.id}/update`);
                                }}
                              >
                                <EditIcon fontSize="inherit" />
                              </IconButton>
                              <IconButton
                                onClick={() =>
                                  handleOpenCustomDialog(ledger.id)
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
                    count={ledger.total}
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

export default LedgerTemplate;
