import yup from 'utils/yup';

export const CreateLedgerCategorySchema = yup.object().shape({
  name: yup.string().required()
});

export const UpdateLedgerCategorySchema = yup.object().shape({
  name: yup.string().required()
});
