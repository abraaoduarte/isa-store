import yup from 'utils/yup';

export const CreateProductSchema = yup.object().shape({
  name: yup.string().required(),
  price: yup.string().required()
});

export const UpdateProductSchema = yup.object().shape({
  name: yup.string().required(),
  price: yup.string().required()
});
