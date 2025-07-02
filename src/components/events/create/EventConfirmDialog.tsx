import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import React from 'react';
import { LoadingButton } from '@mui/lab';
import { buttonStyle } from '../../../styles/CommonStyles';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  onCancel(): void;
  onConfirm(): void;
  children?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmLoading?: boolean;
}

export default function ConfirmDialog({
  open,
  title,
  children,
  onCancel,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmLoading = false,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button sx={buttonStyle} color="error" onClick={onCancel} disabled={confirmLoading}>
          {cancelText}
        </Button>
        <LoadingButton
          sx={buttonStyle}
          onClick={onConfirm}
          loading={confirmLoading}
          disabled={confirmLoading}
          variant="contained"
        >
          {confirmText}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
