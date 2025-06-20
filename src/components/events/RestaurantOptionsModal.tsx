import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Button,
  Typography,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import RestaurantFieldsForm from './RestaurantFieldsForm';
import { RestaurantOption } from '../../types/Event';

interface RestaurantOptionsFormProps {
  eventStartTime?: string;
}

const RestaurantOptionsModal: React.FC<RestaurantOptionsFormProps> = () => {
  const [optionType, setOptionType] = useState<1 | 2 | 3>(1);

  function getCurrentDatetimeLocal() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  const [voteDeadline, setVoteDeadline] = useState(getCurrentDatetimeLocal());
  const [restaurantOptions, setRestaurantOptions] = useState<RestaurantOption[]>([
    { id: Date.now(), name: '' },
  ]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const tomorrowMidnightISO = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.toISOString().slice(0, 16);
  }, []);

  useEffect(() => {
    if (optionType === 2 && restaurantOptions.length === 0) {
      setRestaurantOptions([{ id: Date.now(), name: '' }]);
    }
  }, [optionType, restaurantOptions.length, setRestaurantOptions]);

  const handleAddRestaurantOption = () => {
    setRestaurantOptions((prev) => [...prev, { id: Date.now(), name: '' }]);
  };

  const handleRemoveRestaurantOption = (id: number) => {
    setRestaurantOptions((prev) => prev.filter((r) => r.id !== id));
  };

  const handleRestaurantOptionChange = (
    id: number,
    field: keyof RestaurantOption,
    value: string,
  ) => {
    setRestaurantOptions((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, [field]: value } : opt)),
    );
  };
  const handleVoteDeadlineChange = (value: string) => {
    setVoteDeadline(value);

    const validationError = validateVotingDeadline(value);
    console.log(errors);
    setErrors((prevErrors) => ({
      ...prevErrors,
      voteDeadline: validationError || '',
    }));
  };

  function validateVotingDeadline(voteDeadline: string): string | null {
    if (!voteDeadline) {
      return 'Voting deadline is required.';
    }

    const deadlineDate = new Date(voteDeadline);
    if (isNaN(deadlineDate.getTime())) {
      return 'Invalid date/time format.';
    }

    const now = new Date();
    now.setSeconds(0, 0); // zero seconds and ms to match input granularity

    if (deadlineDate < now) {
      return 'Voting deadline cannot be in the past.';
    }

    return null; // no error
  }

  return (
    <Box display="flex" flexDirection="column" gap={3} marginLeft={1}>
      <Box>
        <Typography variant="subtitle1" fontWeight="bold">
          Select Restaurant Option Type
        </Typography>
        <Box display="flex" flexDirection="column" mt={1}>
          <FormControlLabel
            control={
              <Radio checked={optionType === 1} onChange={() => setOptionType(1)} value={1} />
            }
            label="Choose One Restaurant"
          />
          <FormControlLabel
            control={
              <Radio checked={optionType === 2} onChange={() => setOptionType(2)} value={2} />
            }
            label="Let Participants Vote on Restaurants"
          />
          <FormControlLabel
            control={
              <Radio checked={optionType === 3} onChange={() => setOptionType(3)} value={3} />
            }
            label="Skip Restaurant Selection"
          />
        </Box>
      </Box>

      {optionType === 1 && (
        <Box
          display="flex"
          flexDirection="column"
          gap={1}
          p={2}
          border={1}
          borderRadius={2}
          borderColor="grey.300"
        >
          <Typography variant="subtitle1" gutterBottom>
            Selected Restaurant
          </Typography>
          <RestaurantFieldsForm
            index={0}
            option={restaurantOptions[0] || {}}
            onChangeOption={handleRestaurantOptionChange}
            errorMap={errors}
          />
        </Box>
      )}

      {optionType === 2 && (
        <>
          <TextField
            label="Voting Deadline *"
            type="datetime-local"
            value={voteDeadline}
            onChange={(e) => handleVoteDeadlineChange(e.target.value)}
            error={!!errors.voteDeadline}
            helperText={errors.voteDeadline}
            sx={{ width: '50%' }}
            inputProps={{
              min: tomorrowMidnightISO,
            }}
          />

          {restaurantOptions.map((option, i) => (
            <Box
              key={option.id}
              display="flex"
              flexDirection="column"
              gap={1}
              p={2}
              border={1}
              borderRadius={2}
              borderColor="grey.300"
            >
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="subtitle1">Option {i + 1}</Typography>
                <IconButton
                  onClick={() => handleRemoveRestaurantOption(option.id)}
                  disabled={restaurantOptions.length === 1}
                >
                  <Delete />
                </IconButton>
              </Box>
              <RestaurantFieldsForm
                index={i}
                option={option}
                onChangeOption={handleRestaurantOptionChange}
                errorMap={errors}
              />
            </Box>
          ))}

          <Button variant="outlined" startIcon={<Add />} onClick={handleAddRestaurantOption}>
            Add Restaurant Option
          </Button>
        </>
      )}
    </Box>
  );
};

export default RestaurantOptionsModal;
