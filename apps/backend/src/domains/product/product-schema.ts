import yup from 'utils/yup';

export const CreateProductSchema = yup.object().shape({
  name: yup.string().required(),
  price: yup.number().required('Price required').min(0, 'Price must be greater than 0'),
  quantity: yup.number().required('Quantity required').min(0, 'Quantity must be greater than 0'),
  brand_id: yup.string().required('Brand required'),
  product_category_id: yup.string().required('Category required'),
  productVariation: yup.array().of(
    yup.object().shape({
      color_id: yup.string().required('Color required'),
      quantity: yup
        .number()
        .required('Quantity required')
        .min(1, 'Quantity must be greater than 0'),
      size_id: yup.string().required('Size required')
    })
  ).required()
});

export const UpdateProductSchema = yup.object().shape({
  name: yup.string().required(),
  price: yup.number().required('Price required').min(0, 'Price must be greater than 0'),
  quantity: yup.number().required('Quantity required').min(0, 'Quantity must be greater than 0'),
  brand_id: yup.string().required('Brand required'),
  product_category_id: yup.string().required('Category required'),
  productVariation: yup.array().of(
    yup.object().shape({
      color_id: yup.string().required('Color required'),
      quantity: yup
        .number()
        .required('Quantity required')
        .min(1, 'Quantity must be greater than 0'),
      size_id: yup.string().required('Size required')
    })
  ).required()
});
