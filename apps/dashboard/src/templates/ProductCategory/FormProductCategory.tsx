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
  FormProductCategoryTemplateProps,
  ProductCategoryFormValues,
} from './ProductCategory.interface';
import LoadingProgress from 'components/LoadingProgress';
import CardHeader from 'components/CardHeader';

const schema = yup
  .object({
    name: yup.string().required('Categoria Obrigatória'),
  })
  .required();

export const FormProductCategory: FC<FormProductCategoryTemplateProps> = ({
  pageTitle,
  productCategoryId,
}) => {
  const { data, isSuccess, isError } = useQuery(
    ['productCategory', productCategoryId],
    () => api.get(`product-categories/${productCategoryId}`),
    {
      enabled: !!productCategoryId,
    },
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductCategoryFormValues>({
    resolver: yupResolver(schema),
  });

  const { enqueueSnackbar } = useSnackbar();

  const addProductCategory = useMutation<
    AxiosResponse,
    Error,
    ProductCategoryFormValues,
    unknown
  >((data) => api.post('/product-categories', data));

  const updateProductCategory = useMutation<
    AxiosResponse,
    Error,
    ProductCategoryFormValues,
    unknown
  >((data) => api.patch(`/product-categories/${productCategoryId}`, data));

  useEffect(() => {
    if (productCategoryId && isSuccess) {
      reset(data?.data?.result);
    }
  }, [productCategoryId, data, reset, isSuccess]);

  const onSubmit = (data: ProductCategoryFormValues) => {
    productCategoryId
      ? updateProductCategory.mutate(data, {
          onSuccess: () => {
            Router.push('/product-categories');
          },
          onError: (error) => {
            enqueueSnackbar(error.message, {
              variant: 'error',
            });
          },
        })
      : addProductCategory.mutate(data, {
          onSuccess: () => {
            Router.push('/product-categories');
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
        {productCategoryId && !isSuccess ? (
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
                      label="Categoria"
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
              addProductCategory.isLoading || updateProductCategory.isLoading
            }
            loadingPosition="start"
            startIcon={<SaveIcon />}
            color="primary"
            variant="contained"
            disabled={!isEmpty(errors)}
          >
            {productCategoryId ? 'Atualizar' : 'Salvar'}
          </LoadingButton>
        </Box>
      </form>
    </>
  );
};
