import { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';

const pwdStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  p: 4,
  borderRadius: 2,
  boxShadow: 24,
};

export interface ChangePasswordModalProps {
  open: boolean;
  onClose(): void;
  onChangePassword(data: {
    oldPassword: string;
    newPassword: string;
    newPasswordConfirm: string;
  }): Promise<unknown>;
}

export function ChangePasswordModal({ open, onClose, onChangePassword }: ChangePasswordModalProps) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleChange = async () => {
    setError(null);
    if (newPassword !== newPasswordConfirm) {
      setError('New passwords do not match');
      return;
    }
    try {
      await onChangePassword({ oldPassword, newPassword, newPasswordConfirm });
      onClose();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={pwdStyle}>
        <Typography variant="h6" gutterBottom>
          Change Password
        </Typography>

        <TextField
          label="Current Password"
          type="password"
          fullWidth
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="New Password"
          type="password"
          fullWidth
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Confirm New Password"
          type="password"
          fullWidth
          value={newPasswordConfirm}
          onChange={(e) => setNewPasswordConfirm(e.target.value)}
          sx={{ mb: 2 }}
        />

        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box display="flex" justifyContent="flex-end">
          <Button onClick={onClose} sx={{ mr: 1 }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleChange}>
            Change
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
