import React, { FC } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { CustomDialogProps } from './CustomDialog.interface';

const CustomDialog: FC<CustomDialogProps> = ({
  open,
  onClose,
  message,
  title,
  cancel = 'Cancelar',
  confirm = 'Confirmar',
  onConfirm,
}) => {
  return (
    <div>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{cancel}</Button>
          <Button color="error" onClick={onConfirm} autoFocus>
            {confirm}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CustomDialog;
