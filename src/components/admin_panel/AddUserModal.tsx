import { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import type { CreateUserDTO } from '../../types/User';
import { buttonStyle, AddUserModalStyle, deleteButtonStyle } from '../../styles/CommonStyles';

export interface AddUserModalProps {
  open: boolean;
  onClose(): void;
  onAdd(user: CreateUserDTO): Promise<void>;
}

export default function AddUserModal({ open, onClose, onAdd }: AddUserModalProps) {
  const [values, setValues] = useState({ firstName: '', lastName: '', email: '' });
  const [fieldErrors, setFieldErrors] = useState<Partial<typeof values>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fieldsConfig: Array<{
    name: keyof typeof values;
    label: string;
    type?: string;
    validator?: (val: string) => string | null;
  }> = [
    {
      name: 'firstName',
      label: 'First Name',
      validator: (v) => (!v.trim() ? 'First name is required' : null),
    },
    {
      name: 'lastName',
      label: 'Last Name',
      validator: (v) => (!v.trim() ? 'Last name is required' : null),
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      validator: (v) => {
        if (!v.trim()) return 'Email is required';
        return /\S+@\S+\.\S+/.test(v) ? null : 'Enter a valid email';
      },
    },
  ];

  const handleChange = (name: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValues((prev) => ({ ...prev, [name]: val }));
    setSubmitError(null);
    const validator = fieldsConfig.find((f) => f.name === name)?.validator;
    if (validator) {
      setFieldErrors((prev) => ({ ...prev, [name]: validator(val) }));
    }
  };

  const isFormValid =
    !loading &&
    fieldsConfig.every(({ name, validator }) => {
      const val = values[name];
      const err = validator ? validator(val) : null;
      return !err;
    });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isFormValid && !loading) {
      handleAdd();
    }
  };

  const handleAdd = async () => {
    setSubmitError(null);
    setLoading(true);
    try {
      await onAdd({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
      });
      setValues({ firstName: '', lastName: '', email: '' });
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) setSubmitError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={AddUserModalStyle} onKeyDown={handleKeyDown}>
        <Typography variant="h6" gutterBottom>
          Add New User
        </Typography>

        {fieldsConfig.map(({ name, label, type }) => (
          <TextField
            key={name}
            label={label}
            required
            fullWidth
            type={type}
            value={values[name]}
            onChange={handleChange(name)}
            error={!!fieldErrors[name]}
            helperText={fieldErrors[name]}
            sx={{ mb: 2 }}
          />
        ))}

        {submitError && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {submitError}
          </Typography>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button sx={deleteButtonStyle} onClick={onClose} disabled={loading}>
            Close
          </Button>
          <LoadingButton
            variant="contained"
            sx={buttonStyle}
            onClick={handleAdd}
            loading={loading}
            disabled={!isFormValid}
          >
            Add User
          </LoadingButton>
        </Box>
      </Box>
    </Modal>
  );
}
