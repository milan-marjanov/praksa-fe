import { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { buttonStyle, modalStyle } from '../../styles/CommonStyles';

export interface ChangePasswordModalProps {
  open: boolean;
  onClose(): void;
  onChangePassword(data: {
    oldPassword: string;
    newPassword: string;
    newPasswordConfirm: string;
  }): Promise<void>;
}

export function ChangePasswordModal({ open, onClose, onChangePassword }: ChangePasswordModalProps) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

  const [errors, setErrors] = useState<{
    oldPassword?: string;
    newPassword?: string;
    newPasswordConfirm?: string;
  }>({});

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (open) {
      setOldPassword('');
      setNewPassword('');
      setNewPasswordConfirm('');
      setErrors({});
      setShowOld(false);
      setShowNew(false);
      setShowConfirm(false);
    }
  }, [open]);

  const validate = () => {
    const e: typeof errors = {};
    if (!oldPassword) {
      e.oldPassword = 'Current password is required';
    }
    if (newPassword.length < 6) {
      e.newPassword = 'New password must be at least 6 characters';
    }
    if (oldPassword && newPassword === oldPassword) {
      e.newPassword = 'New password cannot be the same as the current password';
    }
    if (newPasswordConfirm !== newPassword) {
      e.newPasswordConfirm = 'Passwords do not match';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleConfirm = async () => {
    if (!validate()) return;

    try {
      await onChangePassword({ oldPassword, newPassword, newPasswordConfirm });
      toast.success('Password changed successfully');
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrors({ oldPassword: err.message });
      } else {
        setErrors({ oldPassword: 'Something went wrong' });
      }
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" gutterBottom>
          Change Password
        </Typography>

        <TextField
          label="Current Password"
          type={showOld ? 'text' : 'password'}
          fullWidth
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          error={!!errors.oldPassword}
          helperText={errors.oldPassword}
          sx={{ mb: 2 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowOld((s) => !s)} edge="end">
                  {showOld ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="New Password"
          type={showNew ? 'text' : 'password'}
          fullWidth
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          error={!!errors.newPassword}
          helperText={errors.newPassword}
          sx={{ mb: 2 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowNew((s) => !s)} edge="end">
                  {showNew ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Confirm New Password"
          type={showConfirm ? 'text' : 'password'}
          fullWidth
          value={newPasswordConfirm}
          onChange={(e) => setNewPasswordConfirm(e.target.value)}
          error={!!errors.newPasswordConfirm}
          helperText={errors.newPasswordConfirm}
          sx={{ mb: 3 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowConfirm((s) => !s)} edge="end">
                  {showConfirm ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Box display="flex" justifyContent="flex-end">
          <Button sx={{ ...buttonStyle, mr: 1 }} onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" sx={buttonStyle} onClick={handleConfirm}>
            Change
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
