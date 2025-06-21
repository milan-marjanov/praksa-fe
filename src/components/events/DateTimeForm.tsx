import React, { useState, useMemo } from 'react';
import { TextField } from '@mui/material';

type DateTimeFormProps = {
  label: string;
  required?: boolean;
  onValidChange?: (value: string) => void;
};

const DateTimeForm: React.FC<DateTimeFormProps> = ({ label, required = false, onValidChange }) => {
  /*function getCurrentDatetimeLocal() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }*/
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const minISO = useMemo(() => {
    const min = new Date();
    min.setSeconds(0, 0);
    return min.toISOString().slice(0, 16);
  }, []);

  function validate(value: string): string | null {
    if (required && !value) {
      return `${label} is required.`;
    }

    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return 'Invalid date/time format.';
    }

    const now = new Date();
    now.setSeconds(0, 0);

    if (date < now) {
      if (label === '') {
        return `Voting deadline cannot be in the past.`;
      }
      return `${label} cannot be in the past.`;
    }

    return null;
  }

  function handleChange(newValue: string) {
    setValue(newValue);
    const validationResult = validate(newValue);
    setError(validationResult);
    if (!validationResult && onValidChange) {
      onValidChange(newValue);
    }
  }

  return (
    <TextField
      label={label && required ? `${label} *` : label}
      type="datetime-local"
      value={value}
      onChange={(e) => handleChange(e.target.value)}
      error={!!error}
      helperText={error || ' '}
      sx={{ width: '50%' }}
      inputProps={{
        min: minISO,
      }}
    />
  );
};

export default DateTimeForm;
