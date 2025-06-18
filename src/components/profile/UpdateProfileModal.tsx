import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, Avatar, IconButton } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { buttonStyle } from '../../styles/CommonStyles';
import { LoadingButton } from '@mui/lab';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  p: 4,
  borderRadius: 2,
  boxShadow: 24,
};

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
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setFirstName(initialValues.firstName);
      setLastName(initialValues.lastName);
      setEmail(initialValues.email);
      setAvatarPreview(initialValues.avatarUrl);
      setProfileFile(null);
      setError(null);
      setLoading(false);
    }
  }, [open, initialValues]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setProfileFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatarPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUpdate = async () => {
    setError(null);
    setLoading(true);
    try {
      await onUpdate({
        firstName,
        lastName,
        email,
        profilePicture: profileFile || undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" gutterBottom>
          Update Profile
        </Typography>
        <Box display="flex" justifyContent="center" mb={2}>
          <Avatar sx={{ width: 80, height: 80 }} src={avatarPreview} />
          <IconButton component="label" sx={{ ml: -3, mt: 5 }}>
            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
            <PhotoCameraIcon />
          </IconButton>
        </Box>
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
          type="email"
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
        <Box display="flex" justifyContent="flex-end">
          <Button sx={{ ...buttonStyle, mr: 1 }} onClick={onClose}>
            Cancel
          </Button>
          <LoadingButton
            onClick={handleUpdate}
            loading={loading}
            variant="contained"
            sx={buttonStyle}
          >
            Update
          </LoadingButton>
        </Box>
      </Box>
    </Modal>
  );
}
