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
import { BrandFormValues, FormBrandTemplateProps } from './Brand.interface';
import LoadingProgress from 'components/LoadingProgress';
import CardHeader from 'components/CardHeader';

const schema = yup
  .object({
    name: yup.string().required('Tamanho Obrigatório'),
  })
  .required();

export const FormBrand: FC<FormBrandTemplateProps> = ({
  pageTitle,
  brandId,
}) => {
  const { data, isSuccess, isError } = useQuery(
    ['brands', brandId],
    () => api.get(`brands/${brandId}`),
    {
      enabled: !!brandId,
    },
  );

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BrandFormValues>({
    resolver: yupResolver(schema),
  });

  const { enqueueSnackbar } = useSnackbar();

  const addBrand = useMutation<AxiosResponse, Error, BrandFormValues, unknown>(
    (data) => api.post('/brands', data),
  );

  const updateBrand = useMutation<
    AxiosResponse,
    Error,
    BrandFormValues,
    unknown
  >((data) => api.patch(`/brands/${brandId}`, data));

  useEffect(() => {
    if (brandId && isSuccess) {
      setValue('name', data?.data?.result?.name);
      setValue('description', data?.data?.result?.description);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandId, data]);

  const onSubmit = (data: BrandFormValues) => {
    brandId
      ? updateBrand.mutate(data, {
          onSuccess: () => {
            Router.push('/brands');
          },
          onError: (error) => {
            enqueueSnackbar(error.message, {
              variant: 'error',
            });
          },
        })
      : addBrand.mutate(data, {
          onSuccess: () => {
            Router.push('/brands');
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
        <CardHeader subHeader="Insira a marca" title={pageTitle} />
        <Divider />
        {brandId && !isSuccess ? (
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
                      helperText={error?.message}
                      label="Nome"
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
                      helperText={error?.message}
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
            loading={addBrand.isLoading || updateBrand.isLoading}
            loadingPosition="start"
            startIcon={<SaveIcon />}
            color="primary"
            variant="contained"
            disabled={!isEmpty(errors)}
          >
            {brandId ? 'Atualizar' : 'Salvar'}
          </LoadingButton>
        </Box>
      </form>
    </>
  );
};
