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
  Button,
  Paper,
  Stack,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
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
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const schema = yup
  .object({
    total_price: yup.string().required('Preço Obrigatório'),
    due_date: yup.string().required('Data Obrigatório'),
    sellOrderItems: yup.array().of(
      yup.object().shape({
        product_variation_id: yup.string().required('Produto é Obrigatório'),
        total_price: yup.string().required('Preço Obrigatório'),
        quantity: yup
          .number()
          .required('Quantidade é Obrigatório')
          .min(1, 'Quantidade deve ser maior que 0'),
      }),
    ),
  })
  .required();

export const FormSellOrder: FC<FormSellOrderTemplateProps> = ({
  pageTitle,
  sellOrderId,
  products,
}) => {
  const { data, isSuccess } = useQuery(
    ['sellOrder', sellOrderId],
    () => api.get(`sell-orders/${sellOrderId}`),
    {
      enabled: !!sellOrderId,
    },
  );

  const handleAddFields = () => {
    append({
      uuid: undefined,
      color: undefined,
      size: undefined,
      inventory_quantity: undefined,
      price: undefined,
      sku: undefined,
      is_active: true,
    });
  };

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<SellOrderFormValues>({
    resolver: yupResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    name: 'sellOrderItems',
    control,
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
      sellOrderItems: data.sellOrderItems.map((variation) => ({
        ...omit(['size', 'color', 'price', 'uuid'], variation),
        price: String(variation.price).replace('.', '').replace(',', ''),
        inventory_quantity: variation.inventory_quantity,
        sku: variation.sku,
        size_id: variation.size,
        color_id: variation.color,
        is_active: variation.is_active,
      })),
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
      sellOrderItems: data?.data?.result?.sellOrderItems.map(
        (variation: ProductVariation) => ({
          id: variation.id,
          uuid: variation.id,
          inventory_quantity: variation.inventory_quantity,
          is_active: variation.is_active,
          color: variation.color_id,
          size: variation.size_id,
          sku: variation.sku,
          price: variation.price,
        }),
      ),
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
        <CardHeader title="Vendas" subHeader={pageTitle} />
        <Divider />
        {sellOrderId && !isSuccess ? (
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
                    <FormControl fullWidth disabled>
                      <InputLabel
                        disabled
                        error={!!error}
                        htmlFor="outlined-adornment-amount"
                      >
                        Valor total
                      </InputLabel>
                      <OutlinedInput
                        error={!!error}
                        disabled
                        onBlur={onBlur}
                        fullWidth
                        autoComplete="false"
                        id="outlined-adornment-amount"
                        value={value}
                        onChange={onChange}
                        startAdornment={
                          <InputAdornment position="start">R$</InputAdornment>
                        }
                        label="Valor total"
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
              <Grid item md={6} xs={12}>
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
              <Grid item md={12} xs={12}>
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleAddFields}
                  sx={{ marginBottom: 2 }}
                >
                  Adicionar
                </Button>
                {fields.map((field, index) => (
                  <Paper
                    elevation={6}
                    sx={{ padding: 3, marginBottom: 5 }}
                    key={field.id}
                  >
                    <input
                      type="hidden"
                      value={field.id}
                      name="productVariationId"
                    />
                    <Grid container spacing={3}>
                      <Grid item md={4} xs={12}>
                        <Controller
                          control={control}
                          key={field.id}
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
                              label="Tamanho"
                              name={`productVariation.${index}.size`}
                              onBlur={onBlur}
                              type="text"
                              onChange={onChange}
                              value={value ?? ''}
                              variant="outlined"
                            >
                              {products.map((size) => (
                                <MenuItem key={size.id} value={size.id}>
                                  {size.size}
                                </MenuItem>
                              ))}
                            </TextField>
                          )}
                          name={`productVariation.${index}.size`}
                        />
                      </Grid>
                      <Grid item md={4} xs={12}>
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
                                Preço
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
                                  <InputAdornment position="start">
                                    R$
                                  </InputAdornment>
                                }
                                label="Preço"
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
                          name={`productVariation.${index}.price`}
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
                              label="Quantidade"
                              name={`productVariation.${index}.inventory_quantity`}
                              onBlur={onBlur}
                              type="number"
                              onChange={onChange}
                              value={value ?? ''}
                              variant="outlined"
                            />
                          )}
                          name={`productVariation.${index}.inventory_quantity`}
                        />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <Stack
                          direction="row"
                          justifyContent="flex-end"
                          alignItems="center"
                          spacing={1}
                        >
                          <Button
                            size="small"
                            color="error"
                            variant="contained"
                            onClick={() => {
                              field.uuid
                                ? handleOpenCustomDialog(field.uuid, index)
                                : remove(index);
                            }}
                          >
                            <DeleteIcon />
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            onClick={handleAddFields}
                          >
                            <AddIcon />
                          </Button>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Paper>
                ))}
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
