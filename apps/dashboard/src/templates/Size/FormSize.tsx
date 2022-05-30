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
import * as S from './FormSize.styles';

type SizeDataProps = {
  size: string;
  type: string;
  description?: string;
};

const schema = yup
  .object({
    size: yup.string().required('Tamanho Obrigatório'),
    type: yup.string().required('Tipo Obrigatório'),
  })
  .required();

const TYPES = [
  {
    value: undefined,
    label: 'Escolha uma medida',
  },
  {
    value: 'NUMERIC',
    label: 'Numérico',
  },
  {
    value: 'LETTER',
    label: 'Letra',
  },
];

type FormSize = {
  pageTitle: string;
  sizeId?: string;
};

export const FormSize: FC<FormSize> = ({ pageTitle, sizeId }) => {
  const { data, isSuccess } = useQuery(['size', sizeId], () =>
    api.get(`sizes/${sizeId}`),
  );

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SizeDataProps>({
    resolver: yupResolver(schema),
  });

  const values = watch();

  const { enqueueSnackbar } = useSnackbar();

  const addSize = useMutation<AxiosResponse, Error, SizeDataProps, unknown>(
    (data) => api.post('/sizes', data),
  );

  const updateSize = useMutation<AxiosResponse, Error, SizeDataProps, unknown>(
    (data) => api.patch(`/sizes/${sizeId}`, data),
  );

  useEffect(() => {
    if (sizeId && isSuccess) {
      setValue('type', data?.data?.result?.type);
      setValue('size', data?.data?.result?.size);
      setValue('description', data?.data?.result?.description);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sizeId, data]);

  const onSubmit = (data: SizeDataProps) => {
    sizeId
      ? updateSize.mutate(data, {
          onSuccess: () => {
            Router.push('/sizes');
          },
          onError: (error) => {
            enqueueSnackbar(error.message, {
              variant: 'error',
            });
          },
        })
      : addSize.mutate(data, {
          onSuccess: () => {
            Router.push('/sizes');
          },
          onError: (error) => {
            enqueueSnackbar(error.message, {
              variant: 'error',
            });
          },
        });
  };

  if ((!isSuccess && !sizeId) || (sizeId && !isSuccess)) {
    // Router.push('/404');
  }

  return (
    <S.StyledCard>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader
          subheader="Insira o tamanho e dimensões das roupas"
          title={pageTitle}
        />
        <Divider />
        <CardContent>
          <Grid container spacing={4}>
            <Grid item md={6} xs={12}>
              <Controller
                control={control}
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    error={!!error}
                    fullWidth
                    label="Selecione o tipo de medida"
                    helperText={
                      error?.message ||
                      'Se a medida é letra ou numero ex (G or 42)'
                    }
                    name="type"
                    onBlur={onBlur}
                    onChange={(value) => {
                      setValue('size', '');
                      onChange(value);
                    }}
                    required
                    select
                    SelectProps={{ native: true }}
                    value={value ?? data?.data?.result?.type ?? ''}
                    variant="outlined"
                  >
                    {TYPES.map((option, index) => (
                      <option key={index} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </TextField>
                )}
                name="type"
              />
            </Grid>
            <Grid item md={6} xs={12}>
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
                    helperText={
                      error?.message || 'Tamanho do tamanho ex (M, P, 38)'
                    }
                    label="Tamanho"
                    name="size"
                    onBlur={onBlur}
                    type={values.type === 'NUMERIC' ? 'number' : 'text'}
                    onChange={(event) => {
                      const isLetters = (str: string) =>
                        /^[A-Za-z]*$/.test(str);
                      if (
                        values.type !== 'NUMERIC' &&
                        isLetters(event.target.value)
                      ) {
                        return onChange(event.target.value);
                      }

                      if (values.type === 'NUMERIC') {
                        return onChange(event.target.value);
                      }
                    }}
                    value={value ?? ''}
                    variant="outlined"
                  />
                )}
                name="size"
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
            loading={addSize.isLoading || updateSize.isLoading}
            loadingPosition="start"
            startIcon={<SaveIcon />}
            color="primary"
            variant="contained"
            disabled={!isEmpty(errors)}
          >
            {sizeId ? 'Atualizar' : 'Salvar'}
          </LoadingButton>
        </Box>
      </form>
    </S.StyledCard>
  );
};
