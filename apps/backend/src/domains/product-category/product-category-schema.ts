import yup from 'utils/yup';

export const CreateProductCategorieSchema = yup.object().shape({
  name: yup.string().required()
});

export const UpdateProductCategorieSchema = yup.object().shape({
  name: yup.string().required()
});
