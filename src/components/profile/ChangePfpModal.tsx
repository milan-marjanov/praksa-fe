import React, { useState } from 'react';
import { Modal, Box, Typography, Button, Avatar, IconButton } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import buttonStyle from '../../styles/buttonStyle';

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
  onClose(): void;
  onUpload(file: File): Promise<void>;
}

export function ChangePfpModal({ open, onClose, onUpload }: ChangePfpModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Izaberi fajl pre slanja');
      return;
    }
    setError(null);
    try {
      await onUpload(file);
      onClose();
    } catch (e: any) {
      setError(e.message || 'Greška pri uploadu');
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" gutterBottom>
          Promeni profilnu sliku
        </Typography>

        <Box display="flex" justifyContent="center" mb={2}>
          <Avatar src={preview || undefined} sx={{ width: 100, height: 100 }} />
        </Box>

        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="pfp-upload"
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="pfp-upload">
          <IconButton component="span">
            <PhotoCameraIcon />
          </IconButton>
        </label>

        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button sx={{ ...buttonStyle, mr: 1 }} onClick={onClose}>Otkaži</Button>
          <Button variant="contained" sx={buttonStyle} onClick={handleUpload}>
            Sačuvaj
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
