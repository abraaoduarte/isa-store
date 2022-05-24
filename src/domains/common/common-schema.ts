import yup from 'utils/yup';

export const makeUuidSchema = (key: string) =>
  yup.object().shape({
    [key]: yup.string().uuid().required()
  });
