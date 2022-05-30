import { FC, useEffect } from 'react';
import {
  Box,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
} from '@mui/material';
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
import * as S from './FormProductCategory.styles';

type ProductCategoryDataProps = {
  name: string;
  type: string;
  description?: string;
};

const schema = yup
  .object({
    name: yup.string().required('Tamanho Obrigatório'),
  })
  .required();

type FormProductCategory = {
  pageTitle: string;
  productCategoryId?: string;
};

export const FormProductCategory: FC<FormProductCategory> = ({
  pageTitle,
  productCategoryId,
}) => {
  const { data, isSuccess } = useQuery(
    ['productCategory', productCategoryId],
    () => api.get(`product-categories/${productCategoryId}`),
    {
      enabled: !!productCategoryId,
    },
  );

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductCategoryDataProps>({
    resolver: yupResolver(schema),
  });

  const { enqueueSnackbar } = useSnackbar();

  const addProductCategory = useMutation<
    AxiosResponse,
    Error,
    ProductCategoryDataProps,
    unknown
  >((data) => api.post('/product-categories', data));

  const updateProductCategory = useMutation<
    AxiosResponse,
    Error,
    ProductCategoryDataProps,
    unknown
  >((data) => api.patch(`/product-categories/${productCategoryId}`, data));

  useEffect(() => {
    if (productCategoryId && isSuccess) {
      setValue('name', data?.data?.result?.name);
      setValue('description', data?.data?.result?.description);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productCategoryId, data]);

  const onSubmit = (data: ProductCategoryDataProps) => {
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

  if ((!isSuccess && !productCategoryId) || (productCategoryId && !isSuccess)) {
    // Router.push('/404');
  }

  return (
    <S.StyledCard>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader subheader="Insira a categoria" title={pageTitle} />
        <Divider />
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
    </S.StyledCard>
  );
};
