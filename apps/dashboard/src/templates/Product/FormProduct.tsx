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
import { Controller, useForm, useFieldArray } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from 'react-query';
import LoadingButton from '@mui/lab/LoadingButton';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import Router from 'next/router';
import { isEmpty, omit } from 'ramda';
import yup from 'utils/yup';
import { api } from 'services/api';
import { AxiosResponse } from 'axios';
import {
  ProductFormValues,
  FormProductTemplateProps,
} from './Product.interface';
import NumberFormatCustom from 'components/NumberField/NumberField';
import CardHeader from 'components/CardHeader';
import LoadingProgress from 'components/LoadingProgress';
import { ProductVariation } from 'interfaces/api';
import { formatNumberToMoney } from 'utils/formatNumberToMoney';

const schema = yup
  .object({
    name: yup.string().required('Nome Obrigatório'),
    brand: yup.string().required('Marca Obrigatório'),
    discount: yup.string().required('Desconto Obrigatório'),
    quantity: yup.string().required('Quantidade Obrigatório'),
    category: yup.string().required('Categoria Obrigatório'),
    price: yup.string().required('Preço Obrigatório'),
    productVariation: yup.array().of(
      yup.object().shape({
        color: yup.string().required('Cor é Obrigatório'),
        quantity: yup
          .number()
          .required('Quantidade é Obrigatório')
          .min(1, 'Quantidade deve ser maior que 0'),
        size: yup.string().required('Tamanho é Obrigatório'),
      }),
    ),
  })
  .required();

export const FormProduct: FC<FormProductTemplateProps> = ({
  pageTitle,
  productId,
  brands,
  sizes,
  categories,
  colors,
}) => {
  const { data, isSuccess } = useQuery(
    ['product', productId],
    () => api.get(`products/${productId}`),
    {
      enabled: !!productId,
    },
  );

  const handleAddFields = () => {
    append({
      color: undefined,
      size: undefined,
      quantity: undefined,
    });
  };

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    reset,
  } = useForm<ProductFormValues>({
    resolver: yupResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    name: 'productVariation',
    control,
  });
  const watchProductVariation = watch('productVariation', []);

  const totalQuantity = watchProductVariation.reduce((acc, value) => {
    return acc + value.quantity;
  }, 0);
  setValue('quantity', totalQuantity);

  const { enqueueSnackbar } = useSnackbar();

  const addBrand = useMutation<
    AxiosResponse,
    Error,
    ProductFormValues,
    unknown
  >((data) => {
    const normalizeData = {
      ...omit(['price', 'category', 'brand'], data),
      price: String(data.price).replace('.', '').replace(',', ''),
      product_category_id: data.category,
      brand_id: data.brand,
      productVariation: data.productVariation.map((variation) => ({
        ...omit(['size', 'color'], variation),
        size_id: variation.size,
        color_id: variation.color,
      })),
    };

    return api.post('/products', normalizeData);
  });

  const updateBrand = useMutation<
    AxiosResponse,
    Error,
    ProductFormValues,
    unknown
  >((data) => {
    const normalizeData = {
      ...omit(['price', 'category', 'brand'], data),
      price: String(data.price).replace('.', '').replace(',', ''),
      product_category_id: data.category,
      brand_id: data.brand,
      productVariation: data.productVariation.map((variation) => ({
        ...omit(['size', 'color'], variation),
        size_id: variation.size,
        color_id: variation.color,
      })),
    };
    return api.patch(`/products/${productId}`, normalizeData);
  });

  useEffect(() => {
    if (productId && isSuccess) {
      reset({
        ...data?.data?.result,
        price: formatNumberToMoney(data?.data?.result.price).replace('.', ''),
        brand: data?.data?.result.brand_id,
        category: data?.data?.result.product_category_id,
        productVariation: data?.data?.result?.productVariation.map(
          (variation: ProductVariation) => ({
            quantity: variation.quantity,
            color: variation.color_id,
            size: variation.size_id,
          }),
        ),
      });
    }
  }, [productId, data, reset, isSuccess]);

  const onSubmit = (data: ProductFormValues) => {
    productId
      ? updateBrand.mutate(data, {
          onSuccess: () => {
            Router.push('/products');
          },
          onError: (error) => {
            enqueueSnackbar(error.message, {
              variant: 'error',
            });
          },
        })
      : addBrand.mutate(data, {
          onSuccess: () => {
            Router.push('/products');
          },
          onError: (error) => {
            enqueueSnackbar(error.message, {
              variant: 'error',
            });
          },
        });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader title="Produtos" subHeader={pageTitle} />
        <Divider />
        {productId && !isSuccess ? (
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
              <Grid item md={5} xs={12}>
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
                          <InputAdornment position="start">R$</InputAdornment>
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
                  name="price"
                />
              </Grid>
              <Grid item md={5} xs={12}>
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
                        Desconto
                      </InputLabel>
                      <OutlinedInput
                        error={!!error}
                        onBlur={onBlur}
                        fullWidth
                        autoComplete="false"
                        type="number"
                        id="outlined-adornment-amount"
                        value={value ?? ''}
                        onChange={onChange}
                        startAdornment={
                          <InputAdornment position="start">%</InputAdornment>
                        }
                        label="Desconto"
                      />
                      <FormHelperText
                        error={!!error}
                        color={error?.message && 'error'}
                      >
                        {error?.message}
                      </FormHelperText>
                    </FormControl>
                  )}
                  name="discount"
                />
              </Grid>
              <Grid item md={2} xs={12}>
                <Controller
                  control={control}
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <TextField
                      error={!!error}
                      fullWidth
                      disabled
                      autoComplete="false"
                      helperText={error?.message}
                      label="Quantidade"
                      name="quantity"
                      onBlur={onBlur}
                      type="number"
                      onChange={onChange}
                      value={value ?? ''}
                      variant="outlined"
                    />
                  )}
                  name="quantity"
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
                      select
                      fullWidth
                      autoComplete="false"
                      helperText={error?.message}
                      label="Marca"
                      name="brand"
                      onBlur={onBlur}
                      type="text"
                      onChange={onChange}
                      value={value ?? ''}
                      variant="outlined"
                    >
                      {brands.map((brand) => (
                        <MenuItem key={brand.id} value={brand.id}>
                          {brand.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                  name="brand"
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
                      select
                      fullWidth
                      autoComplete="false"
                      helperText={error?.message}
                      label="Categoria"
                      name="category"
                      onBlur={onBlur}
                      onChange={onChange}
                      value={value ?? ''}
                      variant="outlined"
                    >
                      {categories.map((brand) => (
                        <MenuItem key={brand.id} value={brand.id}>
                          {brand.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                  name="category"
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
                      rows={4}
                      name="description"
                    />
                  )}
                  name="description"
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
                              {sizes.map((size) => (
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
                            <TextField
                              error={!!error}
                              select
                              fullWidth
                              autoComplete="false"
                              helperText={error?.message}
                              label="Cor"
                              name={`productVariation.${index}.color`}
                              onBlur={onBlur}
                              type="text"
                              onChange={onChange}
                              value={value ?? ''}
                              variant="outlined"
                            >
                              {colors.map((color) => (
                                <MenuItem key={color.id} value={color.id}>
                                  {color.name}
                                </MenuItem>
                              ))}
                            </TextField>
                          )}
                          name={`productVariation.${index}.color`}
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
                              name={`productVariation.${index}.quantity`}
                              onBlur={onBlur}
                              type="number"
                              onChange={onChange}
                              value={value ?? ''}
                              variant="outlined"
                            />
                          )}
                          name={`productVariation.${index}.quantity`}
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
                            onClick={() => remove(index)}
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
            loading={addBrand.isLoading || updateBrand.isLoading}
            loadingPosition="start"
            startIcon={<SaveIcon />}
            color="primary"
            variant="contained"
            disabled={!isEmpty(errors)}
          >
            {productId ? 'Atualizar' : 'Salvar'}
          </LoadingButton>
        </Box>
      </form>
    </>
  );
};
