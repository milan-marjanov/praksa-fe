import { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import type { CreateUserDTO } from '../../types/User';
import { buttonStyle } from '../../styles/CommonStyles';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  p: 4,
  borderRadius: 1,
  boxShadow: 24,
};

export interface AddUserModalProps {
  open: boolean;
  onClose(): void;
  onAdd(user: CreateUserDTO): Promise<unknown>;
}

export default function AddUserModal({ open, onClose, onAdd }: AddUserModalProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    setError(null);
    setLoading(true);
    try {
      await onAdd({ firstName, lastName, email });
      setFirstName('');
      setLastName('');
      setEmail('');
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" gutterBottom>
          Add New User
        </Typography>

        <TextField
          label="First Name"
          fullWidth
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Last Name"
          fullWidth
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />

        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button sx={buttonStyle} onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <LoadingButton
            variant="contained"
            sx={buttonStyle}
            onClick={handleAdd}
            loading={loading}
            disabled={loading}
          >
            Add User
          </LoadingButton>
        </Box>
      </Box>
    </Modal>
  );
}
