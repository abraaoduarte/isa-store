import { FC, useEffect } from 'react';
import {
  Box,
  CardContent,
  Divider,
  Grid,
  TextField,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from 'react-query';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import Router from 'next/router';
import { isEmpty, omit } from 'ramda';
import yup from 'utils/yup';
import { api } from 'services/api';
import { AxiosError, AxiosResponse } from 'axios';
import {
  SellOrderFormValues,
  FormSellOrderTemplateProps,
} from './SellOrder.interface';
import NumberFormatCustom from 'components/NumberField/NumberField';
import CardHeader from 'components/CardHeader';
import LoadingProgress from 'components/LoadingProgress';
import { parse } from 'date-fns';
import { format, utcToZonedTime } from 'date-fns-tz';

const schema = yup
  .object({
    description: yup.string().required('Descrição Obrigatório'),
    category: yup.string().required('Categoria Obrigatório'),
    amount: yup.string().required('Valor Obrigatório'),
    due_date: yup.string().required('Data Obrigatório'),
  })
  .required();

export const FormSellOrder: FC<FormSellOrderTemplateProps> = ({
  pageTitle,
  sellOrderId,
  categories,
}) => {
  const { data, isSuccess } = useQuery(
    ['sellOrder', sellOrderId],
    () => api.get(`sell-orders/${sellOrderId}`),
    {
      enabled: !!sellOrderId,
    },
  );

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<SellOrderFormValues>({
    resolver: yupResolver(schema),
  });

  const { enqueueSnackbar } = useSnackbar();

  const addSellOrder = useMutation<
    AxiosResponse,
    AxiosError<{ message: string }>,
    SellOrderFormValues,
    unknown
  >((data) => {
    const normalizeData = {
      ...omit(['category', 'amount'], data),
      ledger_category_id: data.category,
      amount: String(data.amount).replace('.', '').replace(',', ''),
      is_paid: data.is_paid,
      due_date: format(new Date(data.due_date), 'MM/dd/yyyy'),
    };

    return api.post('/sell-orders', normalizeData);
  });

  const updateSellOrder = useMutation<
    AxiosResponse,
    AxiosError<{ message: string }>,
    SellOrderFormValues,
    unknown
  >((data) => {
    const normalizeData = {
      ...omit(['price', 'category', 'brand'], data),
      ledger_category_id: data.category,
      amount: String(data.amount).replace('.', '').replace(',', ''),
      is_paid: data.is_paid,
      due_date: format(new Date(data.due_date), 'MM/dd/yyyy'),
    };

    return api.patch(`/sell-orders/${sellOrderId}`, normalizeData);
  });

  useEffect(() => {
    if (sellOrderId && isSuccess) {
      const date = utcToZonedTime(data?.data?.result.due_date, 'UTC');
      const dateFormated = format(date, 'dd/MM/yyyy', {
        timeZone: 'UTC',
      });

      reset({
        ...data?.data?.result,
        category: data?.data?.result.ledger_category_id,
        is_paid: data?.data?.result.is_paid,
        due_date: parse(dateFormated, 'dd/MM/yyyy', new Date()),
      });
    }
  }, [sellOrderId, data, reset, isSuccess]);

  const onSubmit = (data: SellOrderFormValues) => {
    sellOrderId
      ? updateSellOrder.mutate(data, {
          onSuccess: () => {
            Router.push('/sell-orders');
          },
          onError: (error) => {
            enqueueSnackbar(error.response?.data.message || error.message, {
              variant: 'error',
            });
          },
        })
      : addSellOrder.mutate(data, {
          onSuccess: () => {
            Router.push('/sell-orders');
          },
          onError: (error) => {
            enqueueSnackbar(error.response?.data.message || error.message, {
              variant: 'error',
            });
          },
        });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader title="Movimentações" subHeader={pageTitle} />
        <Divider />
        {sellOrderId && !isSuccess ? (
          <LoadingProgress />
        ) : (
          <CardContent>
            <Grid container spacing={4}>
              <Grid item md={4} xs={12}>
                <Controller
                  control={control}
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <TextField
                      error={!!error}
                      select
                      fullWidth
                      autoComplete="false"
                      helperText={error?.message}
                      label="Tipo de movimentação"
                      name="transaction_type"
                      onBlur={onBlur}
                      type="text"
                      onChange={onChange}
                      value={value ?? ''}
                      variant="outlined"
                    >
                      <MenuItem key="credit" value="CREDIT">
                        Crédito
                      </MenuItem>
                      <MenuItem key="debit" value="DEBIT">
                        Débito
                      </MenuItem>
                      )
                    </TextField>
                  )}
                  name="transaction_type"
                />
              </Grid>
              <Grid item md={4} xs={12}>
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
                      label="Descrição"
                      name="description"
                      onBlur={onBlur}
                      type="text"
                      onChange={onChange}
                      value={value ?? ''}
                      variant="outlined"
                    />
                  )}
                  name="description"
                />
              </Grid>
              <Grid item md={4} xs={12}>
                <Controller
                  control={control}
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <TextField
                      error={!!error}
                      select
                      fullWidth
                      autoComplete="false"
                      helperText={error?.message}
                      label="Categoria"
                      name="category"
                      onBlur={onBlur}
                      type="text"
                      onChange={onChange}
                      value={value ?? ''}
                      variant="outlined"
                    >
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                  name="category"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <Controller
                  control={control}
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <FormControl fullWidth>
                      <InputLabel
                        error={!!error}
                        htmlFor="outlined-adornment-amount"
                      >
                        Valor
                      </InputLabel>
                      <OutlinedInput
                        error={!!error}
                        onBlur={onBlur}
                        fullWidth
                        autoComplete="false"
                        id="outlined-adornment-amount"
                        value={value}
                        onChange={onChange}
                        startAdornment={
                          <InputAdornment position="start">R$</InputAdornment>
                        }
                        label="Valor"
                        inputComponent={NumberFormatCustom as any}
                      />

                      <FormHelperText
                        error={!!error}
                        color={error?.message && 'error'}
                      >
                        {error?.message}
                      </FormHelperText>
                    </FormControl>
                  )}
                  name="amount"
                />
              </Grid>
              <Grid item md={4} xs={12}>
                <Controller
                  control={control}
                  render={({
                    field: { onChange, value, onBlur },
                    fieldState: { error },
                  }) => (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <FormControl fullWidth>
                        <MobileDatePicker
                          onClose={() => {
                            setValue('due_date', value);
                          }}
                          inputFormat="dd/MM/yyyy"
                          value={value || null}
                          label="Data"
                          onChange={onChange}
                          showTodayButton
                          openTo="day"
                          renderInput={(params) => (
                            <TextField {...params} onBlur={onBlur} />
                          )}
                        />
                        <FormHelperText
                          error={!!error}
                          color={error?.message && 'error'}
                        >
                          {error?.message}
                        </FormHelperText>
                      </FormControl>
                    </LocalizationProvider>
                  )}
                  name="due_date"
                />
              </Grid>
              <Grid item md={2} xs={12}>
                <Controller
                  control={control}
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <FormControl fullWidth>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value={value ?? false}
                            checked={value ?? false}
                            onChange={onChange}
                            onBlur={onBlur}
                          />
                        }
                        label="Consolidada"
                        labelPlacement="start"
                      />
                      <FormHelperText
                        error={!!error}
                        color={error?.message && 'error'}
                      >
                        {error?.message}
                      </FormHelperText>
                    </FormControl>
                  )}
                  name="is_paid"
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
                      label="Notas"
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value ?? ''}
                      multiline
                      rows={4}
                      name="note"
                    />
                  )}
                  name="note"
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
              addSellOrder.isLoading ||
              updateSellOrder.isLoading ||
              (!!sellOrderId && !isSuccess)
            }
            loadingPosition="start"
            startIcon={<SaveIcon />}
            color="primary"
            variant="contained"
            disabled={
              !isEmpty(errors) ||
              addSellOrder.isLoading ||
              updateSellOrder.isLoading
            }
          >
            {sellOrderId ? 'Atualizar' : 'Salvar'}
          </LoadingButton>
        </Box>
      </form>
    </>
  );
};
