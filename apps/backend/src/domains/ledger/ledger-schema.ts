import yup from 'utils/yup';

export const CreateLedgerSchema = yup.object().shape({
  description: yup.string().required(),
  amount: yup.number().required('Amount required').min(0, 'Amount must be greater than 0')
});

export const UpdateLedgerSchema = yup.object().shape({
  description: yup.string().required(),
  amount: yup.number().required('Amount required').min(0, 'Amount must be greater than 0')
});
