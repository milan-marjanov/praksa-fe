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
import { buttonStyle } from '../../styles/style';

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

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (open) {
      setOldPassword('');
      setNewPassword('');
      setNewPasswordConfirm('');
      setError(null);
      setShowOld(false);
      setShowNew(false);
      setShowConfirm(false);
    }
  }, [open]);

  const handleChange = async () => {
    setError(null);
    if (newPassword !== newPasswordConfirm) {
      setError('New passwords do not match');
      return;
    }
    try {
      await onChangePassword({ oldPassword, newPassword, newPasswordConfirm });
      toast.success('Password changed successfully');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error changing password');
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
          type={showOld ? 'text' : 'password'}
          fullWidth
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" onClick={() => setShowOld((s) => !s)}>
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
          sx={{ mb: 2 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" onClick={() => setShowNew((s) => !s)}>
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
          sx={{ mb: 2 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" onClick={() => setShowConfirm((s) => !s)}>
                  {showConfirm ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Box display="flex" justifyContent="flex-end">
          <Button sx={{ ...buttonStyle, mr: 1 }} onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" sx={buttonStyle} onClick={handleChange}>
            Change
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
