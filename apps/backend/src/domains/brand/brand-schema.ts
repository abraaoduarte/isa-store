import yup from 'utils/yup';

const CreateBrandSchema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string()
});

const UpdateBrandSchema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string()
});

export { CreateBrandSchema, UpdateBrandSchema };
