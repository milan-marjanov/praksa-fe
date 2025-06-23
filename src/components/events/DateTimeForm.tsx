import React, { useState, useMemo, useEffect } from 'react';
import { TextField } from '@mui/material';

type DateTimeFormProps = {
  label: string;
  required?: boolean;
  initialValue?: string;
  value?: string;
  onValidChange?: (value: string) => void;
};

const DateTimeForm: React.FC<DateTimeFormProps> = ({
  label,
  initialValue,
  required = false,
  value: externalValue,
  onValidChange,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [value, setValue] = useState<string>(initialValue || '');

  useEffect(() => {
    if (externalValue !== undefined) {
      setValue(externalValue);
      const validationResult = validate(externalValue);
      setError(validationResult);
    } else {
      setValue(initialValue || '');
    }
  }, [externalValue, initialValue]);

  const minISO = useMemo(() => {
    const min = new Date();
    min.setSeconds(0, 0);
    return min.toISOString().slice(0, 16);
  }, []);

  function validate(value: string): string | null {
    if (required && !value) {
      return label ? `${label} is required.` : `Voting deadline is required.`;
    }

    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return 'Invalid date/time format.';
    }

    const now = new Date();
    now.setSeconds(0, 0);

    if (date < now) {
      return label ? `${label} cannot be in the past.` : `Voting deadline cannot be in the past.`;
    }

    return null;
  }

  function handleChange(newValue: string) {
    setValue(newValue);
    const validationResult = validate(newValue);
    setError(validationResult);
    if (onValidChange) {
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
