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
import { ColorFormValues, FormColorTemplateProps } from './Color.interface';
import LoadingProgress from 'components/LoadingProgress';
import CardHeader from 'components/CardHeader';

const schema = yup
  .object({
    name: yup.string().required('Tamanho Obrigatório'),
  })
  .required();

export const FormColor: FC<FormColorTemplateProps> = ({
  pageTitle,
  colorId,
}) => {
  const { data, isSuccess, isError } = useQuery(
    ['color', colorId],
    () => api.get(`colors/${colorId}`),
    {
      enabled: !!colorId,
    },
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ColorFormValues>({
    resolver: yupResolver(schema),
  });

  const { enqueueSnackbar } = useSnackbar();

  const addColor = useMutation<AxiosResponse, Error, ColorFormValues, unknown>(
    (data) => api.post('/colors', data),
  );

  const updateColor = useMutation<
    AxiosResponse,
    Error,
    ColorFormValues,
    unknown
  >((data) => api.patch(`/colors/${colorId}`, data));

  useEffect(() => {
    if (colorId && isSuccess) {
      reset(data?.data?.result);
    }
  }, [colorId, data, reset, isSuccess]);

  const onSubmit = (data: ColorFormValues) => {
    colorId
      ? updateColor.mutate(data, {
          onSuccess: () => {
            Router.push('/colors');
          },
          onError: (error) => {
            enqueueSnackbar(error.message, {
              variant: 'error',
            });
          },
        })
      : addColor.mutate(data, {
          onSuccess: () => {
            Router.push('/colors');
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
        <CardHeader title="Cores" subHeader={pageTitle} />
        <Divider />
        {colorId && !isSuccess ? (
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
                      label="Nome da cor"
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
            loading={addColor.isLoading || updateColor.isLoading}
            loadingPosition="start"
            startIcon={<SaveIcon />}
            color="primary"
            variant="contained"
            disabled={!isEmpty(errors)}
          >
            {colorId ? 'Atualizar' : 'Salvar'}
          </LoadingButton>
        </Box>
      </form>
    </>
  );
};
