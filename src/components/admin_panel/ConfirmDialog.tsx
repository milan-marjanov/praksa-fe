import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import React from 'react';

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
        <Button onClick={onCancel}>Cancel</Button>
        <Button color="error" onClick={onConfirm}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
