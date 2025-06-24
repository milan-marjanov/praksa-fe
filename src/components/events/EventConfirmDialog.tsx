import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import React from 'react';
import { buttonStyle } from '../../styles/CommonStyles';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  onCancel(): void;
  onConfirm(): void;
  children?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmDialog({
  open,
  title,
  children,
  onCancel,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button sx={buttonStyle} onClick={onConfirm}>
          {confirmText}
        </Button>
        <Button sx={buttonStyle} color="error" onClick={onCancel}>
          {cancelText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
