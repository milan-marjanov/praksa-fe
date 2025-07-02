import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, Avatar, IconButton } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { buttonStyle, modalStyle } from '../../styles/CommonStyles';
import { LoadingButton } from '@mui/lab';

export interface UpdateProfileModalProps {
  open: boolean;
  onClose(): void;
  onUpdate(data: {
    firstName: string;
    lastName: string;
    email: string;
    profilePicture?: File;
  }): Promise<unknown>;
  initialValues: {
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl?: string;
  };
}

export function UpdateProfileModal({
  open,
  onClose,
  onUpdate,
  initialValues,
}: UpdateProfileModalProps) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState({ loading: false, error: '' });

  useEffect(() => {
    if (open) {
      setForm({
        firstName: initialValues.firstName,
        lastName: initialValues.lastName,
        email: initialValues.email,
      });
      setPreview(initialValues.avatarUrl);
      setFile(null);
      setStatus({ loading: false, error: '' });
    }
  }, [open, initialValues]);

  const handleChange = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) {
      const reader = new FileReader();
      reader.onload = () => typeof reader.result === 'string' && setPreview(reader.result);
      reader.readAsDataURL(f);
    }
  };

  const handleUpdate = async () => {
    setStatus({ loading: true, error: '' });
    try {
      await onUpdate({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        profilePicture: file ?? undefined,
      });
      onClose();
    } catch (err: unknown) {
      setStatus({
        loading: false,
        error: err instanceof Error ? err.message : 'Error updating profile',
      });
      return;
    }
    setStatus((s) => ({ ...s, loading: false }));
  };

  const isDirty =
    form.firstName !== initialValues.firstName ||
    form.lastName !== initialValues.lastName ||
    form.email !== initialValues.email ||
    file !== null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" gutterBottom>
          Update Profile
        </Typography>

        <Box display="flex" justifyContent="center" mb={2}>
          <Avatar sx={{ width: 80, height: 80 }} src={preview} />
          <IconButton component="label" sx={{ ml: -3, mt: 5 }}>
            <input hidden accept="image/*" type="file" onChange={handleFileChange} />
            <PhotoCameraIcon />
          </IconButton>
        </Box>

        <TextField
          label="First Name"
          fullWidth
          value={form.firstName}
          onChange={handleChange('firstName')}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Last Name"
          fullWidth
          value={form.lastName}
          onChange={handleChange('lastName')}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Email"
          type="email"
          fullWidth
          value={form.email}
          onChange={handleChange('email')}
          sx={{ mb: 2 }}
        />

        {status.error && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {status.error}
          </Typography>
        )}

        <Box display="flex" justifyContent="flex-end">
          <Button sx={{ ...buttonStyle, mr: 1 }} onClick={onClose} disabled={status.loading}>
            Cancel
          </Button>
          <LoadingButton
            loading={status.loading}
            variant="contained"
            sx={buttonStyle}
            onClick={handleUpdate}
            disabled={!isDirty}
          >
            Update
          </LoadingButton>
        </Box>
      </Box>
    </Modal>
  );
}
