import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { deleteButtonStyle } from '../../../styles/CommonStyles';

interface ConfirmOptionProps {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmOption({
  open,
  title,
  children,
  onCancel,
  onConfirm,
  confirmText = 'Yes',
  cancelText = 'Cancel',
}: ConfirmOptionProps) {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button sx={deleteButtonStyle} onClick={onCancel}>
          {cancelText}
        </Button>
        <Button sx={{...deleteButtonStyle, color:"white"}} onClick={onConfirm} variant="contained">
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
