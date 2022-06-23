import { FC, useEffect } from 'react';
import {
  Box,
  CardContent,
  Divider,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormHelperText,
  FormControl,
  InputLabel,
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
import CardHeader from 'components/CardHeader';
import LoadingProgress from 'components/LoadingProgress';
import { FormSizeTemplateProps, SizeFormValues } from './Size.interface';

const schema = yup
  .object({
    size: yup.string().required('Tamanho Obrigatório'),
    type: yup.string().required('Tipo Obrigatório'),
  })
  .required();

const TYPES = [
  {
    value: '',
    label: 'Selecione o tipo de medida',
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

export const FormSize: FC<FormSizeTemplateProps> = ({ pageTitle, sizeId }) => {
  const { data, isSuccess, isError } = useQuery(
    ['size', sizeId],
    () => api.get(`sizes/${sizeId}`),
    {
      enabled: !!sizeId,
    },
  );

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<SizeFormValues>({
    resolver: yupResolver(schema),
  });

  const values = watch();

  const { enqueueSnackbar } = useSnackbar();

  const addSize = useMutation<AxiosResponse, Error, SizeFormValues, unknown>(
    (data) => api.post('/sizes', data),
  );

  const updateSize = useMutation<AxiosResponse, Error, SizeFormValues, unknown>(
    (data) => api.patch(`/sizes/${sizeId}`, data),
  );

  useEffect(() => {
    if (sizeId && isSuccess) {
      reset(data?.data?.result);
    }
  }, [sizeId, data, reset, isSuccess]);

  const onSubmit = (data: SizeFormValues) => {
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

  if (isError) {
    Router.push('/404');
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader subHeader="Insira a medida da roupa" title={pageTitle} />
        <Divider />
        {sizeId && !isSuccess ? (
          <LoadingProgress />
        ) : (
          <CardContent>
            <Grid container spacing={4}>
              <Grid item md={6} xs={12}>
                <Controller
                  control={control}
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-helper-label">
                          Selecione o tipo de medida
                        </InputLabel>
                        <Select
                          error={!!error}
                          fullWidth
                          label="Selecione o tipo de medida"
                          name="type"
                          onBlur={onBlur}
                          onChange={(value) => {
                            setValue('size', '');
                            onChange(value);
                          }}
                          displayEmpty
                          value={value ?? data?.data?.result?.type ?? ''}
                          variant="outlined"
                        >
                          {TYPES.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText error={!!error}>
                          {error?.message ||
                            'Se a medida é letra ou numero ex (G or 42)'}
                        </FormHelperText>
                      </FormControl>
                    </>
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
                      disabled={!values.type}
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
    </>
  );
};
