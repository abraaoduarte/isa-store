import { FC, useEffect, useState } from 'react';
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
  FormControlLabel,
  Checkbox,
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
import { AxiosError, AxiosResponse } from 'axios';
import slugify from 'slugify';
import {
  ProductFormValues,
  FormProductTemplateProps,
} from './Product.interface';
import NumberFormatCustom from 'components/NumberField/NumberField';
import CardHeader from 'components/CardHeader';
import LoadingProgress from 'components/LoadingProgress';
import { ProductVariation } from 'interfaces/api';
import { DialogControlProps } from 'components/CustomDialog/CustomDialog.interface';
import CustomDialog from 'components/CustomDialog';

const schema = yup
  .object({
    name: yup.string().required('Nome Obrigatório'),
    slug: yup.string().required('Slug Obrigatório'),
    brand: yup.string().required('Marca Obrigatório'),
    category: yup.string().required('Categoria Obrigatório'),
    productVariation: yup.array().of(
      yup.object().shape({
        color: yup.string().required('Cor é Obrigatório'),
        sku: yup.string().required('Cod Obrigatório'),
        price: yup.string().required('Preço Obrigatório'),
        inventory_quantity: yup
          .number()
          .required('Quantidade é Obrigatório')
          .min(1, 'Quantidade deve ser maior que 0'),
        size: yup.string().required('Tamanho é Obrigatório'),
        is_active: yup.bool().required('Status é obrigatório'),
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
  const [dialog, setDialog] = useState<DialogControlProps>({
    isOpen: false,
  });

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
  } = useForm<ProductFormValues>({
    resolver: yupResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    name: 'productVariation',
    control,
  });

  const { enqueueSnackbar } = useSnackbar();

  const addBrand = useMutation<
    AxiosResponse,
    AxiosError<{ message: string }>,
    ProductFormValues,
    unknown
  >((data) => {
    const normalizeData = {
      ...omit(['category', 'brand'], data),
      product_category_id: data.category,
      brand_id: data.brand,
      discountable: data.discountable,
      productVariation: data.productVariation.map((variation) => ({
        ...omit(['size', 'color', 'price', 'uuid'], variation),
        price: String(variation.price).replace('.', '').replace(',', ''),
        inventory_quantity: variation.inventory_quantity,
        sku: variation.sku,
        size_id: variation.size,
        color_id: variation.color,
        is_active: variation.is_active,
      })),
    };

    return api.post('/products', normalizeData);
  });

  const updateBrand = useMutation<
    AxiosResponse,
    AxiosError<{ message: string }>,
    ProductFormValues,
    unknown
  >((data) => {
    const normalizeData = {
      ...omit(['price', 'category', 'brand'], data),
      product_category_id: data.category,
      brand_id: data.brand,
      discountable: data.discountable || false,
      productVariation: data.productVariation.map((variation) => ({
        ...omit(['size', 'color', 'price', 'uuid'], variation),
        price: String(variation.price).replace('.', '').replace(',', ''),
        size_id: variation.size,
        sku: variation.sku,
        is_active: variation.is_active,
        inventory_quantity: variation.inventory_quantity,
        color_id: variation.color,
      })),
    };

    return api.patch(`/products/${productId}`, normalizeData);
  });

  useEffect(() => {
    if (productId && isSuccess) {
      reset({
        ...data?.data?.result,
        brand: data?.data?.result.brand_id,
        category: data?.data?.result.product_category_id,
        discountable: data?.data?.result.discountable,
        productVariation: data?.data?.result?.productVariation.map(
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
            enqueueSnackbar(error.response?.data.message || error.message, {
              variant: 'error',
            });
          },
        })
      : addBrand.mutate(data, {
          onSuccess: () => {
            Router.push('/products');
          },
          onError: (error) => {
            enqueueSnackbar(error.response?.data.message || error.message, {
              variant: 'error',
            });
          },
        });
  };

  const deleteProductVariation = useMutation<
    AxiosResponse,
    AxiosError<{ message: string }>,
    string,
    unknown
  >((productVariationId) =>
    api.delete(`/product-variations/${productVariationId}`),
  );

  const handleDelete = () => {
    if (dialog.id) {
      deleteProductVariation.mutate(dialog.id, {
        onSuccess: () => {
          remove(dialog.index);
          enqueueSnackbar('Produto deletado com sucesso!', {
            variant: 'success',
          });
        },
        onError: (error) => {
          enqueueSnackbar(error.message, {
            variant: 'error',
          });
        },
      });
    }
    setDialog({
      id: undefined,
      index: undefined,
      isOpen: false,
    });
  };

  const handleOpenCustomDialog = (id: string, index: number) => {
    setDialog({
      isOpen: true,
      index,
      id,
    });
  };

  const handleCloseCustomDialog = () => {
    setDialog({
      isOpen: false,
      id: undefined,
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
                      helperText={error?.message}
                      label="Nome"
                      name="name"
                      onBlur={onBlur}
                      type="text"
                      onChange={(event) => {
                        onChange(event.currentTarget.value);
                        setValue(
                          'slug',
                          slugify(event.currentTarget.value, {
                            lower: true,
                          }),
                        );
                      }}
                      value={value ?? ''}
                      variant="outlined"
                    />
                  )}
                  name="name"
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
                      helperText={error?.message}
                      label="Slug"
                      name="slug"
                      onBlur={(event) => {
                        setValue(
                          'slug',
                          slugify(event.currentTarget.value, {
                            lower: true,
                          }),
                        );
                        onBlur();
                      }}
                      type="text"
                      onChange={onChange}
                      value={value ?? ''}
                      variant="outlined"
                    />
                  )}
                  name="slug"
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
                <Controller
                  control={control}
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <FormControl>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value={value ?? false}
                            checked={value ?? false}
                            onChange={onChange}
                            onBlur={onBlur}
                          />
                        }
                        label="Aplica desconto?"
                        labelPlacement="top"
                      />
                      <FormHelperText
                        error={!!error}
                        color={error?.message && 'error'}
                      >
                        {error?.message}
                      </FormHelperText>
                    </FormControl>
                  )}
                  name="discountable"
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
                              helperText={error?.message}
                              label="SKU (Código)"
                              name={`productVariation.${index}.sku`}
                              onBlur={onBlur}
                              type="text"
                              onChange={onChange}
                              value={value ?? ''}
                              variant="outlined"
                            />
                          )}
                          name={`productVariation.${index}.sku`}
                        />
                      </Grid>
                      <Grid item md={2} xs={12}>
                        <Controller
                          control={control}
                          render={({
                            field: { onChange, onBlur, value },
                            fieldState: { error },
                          }) => (
                            <FormControl>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    value={value}
                                    checked={value}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                  />
                                }
                                label="Produto ativo?"
                                labelPlacement="top"
                              />
                              <FormHelperText
                                error={!!error}
                                color={error?.message && 'error'}
                              >
                                {error?.message}
                              </FormHelperText>
                            </FormControl>
                          )}
                          name={`productVariation.${index}.is_active`}
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
              addBrand.isLoading ||
              updateBrand.isLoading ||
              (!!productId && !isSuccess)
            }
            loadingPosition="start"
            startIcon={<SaveIcon />}
            color="primary"
            variant="contained"
            disabled={
              !isEmpty(errors) || addBrand.isLoading || updateBrand.isLoading
            }
          >
            {productId ? 'Atualizar' : 'Salvar'}
          </LoadingButton>
        </Box>
      </form>
      <CustomDialog
        title="Tem certeza que deseja deletar?"
        message="Após deletado, esse dado não poderá ser recuperado"
        open={dialog.isOpen}
        onConfirm={handleDelete}
        onClose={handleCloseCustomDialog}
      />
    </>
  );
};
