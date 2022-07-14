import { FC, useEffect } from 'react';
import { Box, CardContent, Divider, Grid, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from 'react-query';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import Router from 'next/router';
import { isEmpty } from 'ramda';
import yup from 'utils/yup';
import { api } from 'services/api';
import { AxiosResponse } from 'axios';
import {
  FormLedgerCategoryTemplateProps,
  LedgerCategoryFormValues,
} from './LedgerCategory.interface';
import LoadingProgress from 'components/LoadingProgress';
import CardHeader from 'components/CardHeader';

const schema = yup
  .object({
    name: yup.string().required('Tamanho Obrigatório'),
  })
  .required();

export const FormLedgerCategory: FC<FormLedgerCategoryTemplateProps> = ({
  pageTitle,
  ledgerCategoryId,
}) => {
  const { data, isSuccess, isError } = useQuery(
    ['ledgerCategory', ledgerCategoryId],
    () => api.get(`ledger-categories/${ledgerCategoryId}`),
    {
      enabled: !!ledgerCategoryId,
    },
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LedgerCategoryFormValues>({
    resolver: yupResolver(schema),
  });

  const { enqueueSnackbar } = useSnackbar();

  const addLedgerCategory = useMutation<
    AxiosResponse,
    Error,
    LedgerCategoryFormValues,
    unknown
  >((data) => api.post('/ledger-categories', data));

  const updateLedgerCategory = useMutation<
    AxiosResponse,
    Error,
    LedgerCategoryFormValues,
    unknown
  >((data) => api.patch(`/ledger-categories/${ledgerCategoryId}`, data));

  useEffect(() => {
    if (ledgerCategoryId && isSuccess) {
      reset(data?.data?.result);
    }
  }, [ledgerCategoryId, data, reset, isSuccess]);

  const onSubmit = (data: LedgerCategoryFormValues) => {
    ledgerCategoryId
      ? updateLedgerCategory.mutate(data, {
          onSuccess: () => {
            Router.push('/ledger-categories');
          },
          onError: (error) => {
            enqueueSnackbar(error.message, {
              variant: 'error',
            });
          },
        })
      : addLedgerCategory.mutate(data, {
          onSuccess: () => {
            Router.push('/ledger-categories');
          },
          onError: (error) => {
            enqueueSnackbar(error.message, {
              variant: 'error',
            });
          },
        });
  };

  if (isError) {
    Router.push('/404');
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader title="Categorias" subHeader={pageTitle} />
        <Divider />
        {ledgerCategoryId && !isSuccess ? (
          <LoadingProgress />
        ) : (
          <CardContent>
            <Grid container spacing={4}>
              <Grid item md={12} xs={12}>
                <Controller
                  control={control}
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <TextField
                      error={!!error}
                      fullWidth
                      autoComplete="false"
                      helperText={error?.message || 'Nome da categoria'}
                      label="Cateogria"
                      name="name"
                      onBlur={onBlur}
                      type="text"
                      onChange={onChange}
                      value={value ?? ''}
                      variant="outlined"
                    />
                  )}
                  name="name"
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <Controller
                  control={control}
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <TextField
                      error={!!error}
                      helperText={error?.message || 'Descrição'}
                      sx={{ width: '100%' }}
                      id="outlined-multiline-static"
                      label="Descrição"
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value ?? ''}
                      multiline
                      rows={6}
                      name="description"
                    />
                  )}
                  name="description"
                />
              </Grid>
            </Grid>
          </CardContent>
        )}
        <Divider />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            p: 2,
          }}
        >
          <LoadingButton
            type="submit"
            loading={
              addLedgerCategory.isLoading || updateLedgerCategory.isLoading
            }
            loadingPosition="start"
            startIcon={<SaveIcon />}
            color="primary"
            variant="contained"
            disabled={!isEmpty(errors)}
          >
            {ledgerCategoryId ? 'Atualizar' : 'Salvar'}
          </LoadingButton>
        </Box>
      </form>
    </>
  );
};
