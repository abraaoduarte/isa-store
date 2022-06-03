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
import * as S from './Color.styles';

type ColorDataProps = {
  name: string;
  type: string;
  description?: string;
};

const schema = yup
  .object({
    name: yup.string().required('Tamanho Obrigatório'),
  })
  .required();

type FormColorProps = {
  pageTitle: string;
  colorId?: string;
};

export const FormColor: FC<FormColorProps> = ({ pageTitle, colorId }) => {
  const { data, isSuccess } = useQuery(
    ['color', colorId],
    () => api.get(`colors/${colorId}`),
    {
      enabled: !!colorId,
    },
  );

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ColorDataProps>({
    resolver: yupResolver(schema),
  });

  const { enqueueSnackbar } = useSnackbar();

  const addColor = useMutation<AxiosResponse, Error, ColorDataProps, unknown>(
    (data) => api.post('/colors', data),
  );

  const updateColor = useMutation<
    AxiosResponse,
    Error,
    ColorDataProps,
    unknown
  >((data) => api.patch(`/colors/${colorId}`, data));

  useEffect(() => {
    if (colorId && isSuccess) {
      setValue('name', data?.data?.result?.name);
      setValue('description', data?.data?.result?.description);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorId, data]);

  const onSubmit = (data: ColorDataProps) => {
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

  if ((!isSuccess && !colorId) || (colorId && !isSuccess)) {
    // Router.push('/404');
  }

  return (
    <S.StyledCard>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader subheader="Insira a cor" title={pageTitle} />
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
                    helperText={error?.message || 'Nome da cor'}
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
    </S.StyledCard>
  );
};
