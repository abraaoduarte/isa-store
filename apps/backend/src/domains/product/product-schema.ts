import yup from 'utils/yup';

export const CreateProductSchema = yup.object().shape({
  name: yup.string().required(),
  slug: yup.string().required(),
  brand_id: yup.string().required('Brand required'),
  product_category_id: yup.string().required('Category required'),
  productVariation: yup.array().of(
    yup.object().shape({
      color_id: yup.string().required('Color required'),
      inventory_quantity: yup
        .number()
        .required('Quantity required')
        .min(1, 'Quantity must be greater than 0'),
      size_id: yup.string().required('Size required'),
      price: yup.number().required('Price required').min(0, 'Price must be greater than 0')
    })
  ).required()
});

export const UpdateProductSchema = yup.object().shape({
  name: yup.string().required(),
  slug: yup.string().required(),
  brand_id: yup.string().required('Brand required'),
  product_category_id: yup.string().required('Category required'),
  productVariation: yup.array().of(
    yup.object().shape({
      color_id: yup.string().required('Color required'),
      inventory_quantity: yup
        .number()
        .required('Quantity required')
        .min(1, 'Quantity must be greater than 0'),
      size_id: yup.string().required('Size required'),
      price: yup.number().required('Price required').min(0, 'Price must be greater than 0')
    })
  ).required()
});
