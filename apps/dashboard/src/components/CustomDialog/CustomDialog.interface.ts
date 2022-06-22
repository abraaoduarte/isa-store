export interface CustomDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  title: string;
  cancel?: string;
  confirm?: string;
}

export interface DialogControlProps {
  id?: string;
  isOpen: boolean;
}
