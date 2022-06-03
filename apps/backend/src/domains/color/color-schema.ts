import yup from 'utils/yup';

export const CreateColorSchema = yup.object().shape({
  name: yup.string().required()
});

export const UpdateColorSchema = yup.object().shape({
  name: yup.string().required()
});
