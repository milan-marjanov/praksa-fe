import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, Avatar, IconButton } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { buttonStyle } from '../../styles/CommonStyles';

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

export interface ChangePfpModalProps {
  open: boolean;
  initialPreview?: string;
  onClose(): void;
  onUpload(file: File): Promise<void>;
  onRemove(): Promise<void>;
}

export function ChangePfpModal({
  open,
  initialPreview,
  onClose,
  onUpload,
  onRemove,
}: ChangePfpModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [removed, setRemoved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setPreview(initialPreview || null);
      setFile(null);
      setRemoved(false);
      setError(null);
    }
  }, [open, initialPreview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setRemoved(false);
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const handleRemove = () => {
    setRemoved(true);
    setFile(null);
    setPreview(null);
    setError(null);
  };

  const handleSave = async () => {
    setError(null);
    try {
      if (removed) {
        await onRemove();
      } else if (file) {
        await onUpload(file);
      }
      onClose();
    } catch (e: any) {
      setError(e.message || 'Error saving changes');
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" gutterBottom>
          Promeni profilnu sliku
        </Typography>

        <Box position="relative" display="flex" justifyContent="center" mb={2}>
          <Avatar src={preview || undefined} sx={{ width: 100, height: 100 }} />
          <IconButton
            component="label"
            sx={{ position: 'absolute', bottom: 0, right: 'calc(50% - 50px)' }}
          >
            <input accept="image/*" type="file" hidden onChange={handleFileChange} />
            <PhotoCameraIcon />
          </IconButton>
        </Box>

        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button sx={buttonStyle} onClick={handleRemove}>
            Remove
          </Button>
          <Box sx={{ flex: 1 }} />
          <Button sx={{ ...buttonStyle, mr: 1 }} onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" sx={buttonStyle} onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
