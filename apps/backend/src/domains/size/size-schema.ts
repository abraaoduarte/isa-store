import yup from 'utils/yup';

export const CreateSizeSchema = yup.object().shape({
  size: yup.string().required(),
  type: yup.mixed().oneOf(['NUMERIC', 'LETTER']).required()
});

export const UpdateSizeSchema = yup.object().shape({
  size: yup.string().required(),
  type: yup.mixed().oneOf(['NUMERIC', 'LETTER']).required()
});
