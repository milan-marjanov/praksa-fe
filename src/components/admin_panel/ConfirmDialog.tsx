import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import React from 'react';
import { buttonStyle } from '../../styles/style';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  onCancel(): void;
  onConfirm(): void;
  children: React.ReactNode;
}

export default function ConfirmDialog({
  open,
  title,
  children,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button sx={buttonStyle} onClick={onCancel}>
          Cancel
        </Button>
        <Button sx={buttonStyle} color="error" onClick={onConfirm}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
