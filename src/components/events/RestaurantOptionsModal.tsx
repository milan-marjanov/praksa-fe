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
import { RestaurantOption } from './RestaurantOptionsForm';
import RestaurantFieldsForm from './RestaurantFieldsForm';

interface RestaurantOptionsFormProps {
  restaurantOptions: RestaurantOption[];
  setRestaurantOptions: React.Dispatch<React.SetStateAction<RestaurantOption[]>>;
  onAddOption: () => void;
  onRemoveOption: (id: number) => void;
  onChangeOption: (id: number, field: keyof RestaurantOption, value: string) => void;
  voteDeadline: string;
  onChangeVoteDeadline: (value: string) => void;
  errorMap?: Record<string, string>;
  eventStartTime?: string;
}

const RestaurantOptionsModal: React.FC<RestaurantOptionsFormProps> = ({
  restaurantOptions,
  setRestaurantOptions,

  onAddOption,
  onRemoveOption,
  onChangeOption,
  voteDeadline,
  onChangeVoteDeadline,
  errorMap = {},
}) => {
  const [optionType, setOptionType] = useState<1 | 2 | 3>(1);
  const tomorrowMidnightISO = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0); // set to 00:00 of next day
    return tomorrow.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
  }, []);

  useEffect(() => {
    if (optionType === 2 && restaurantOptions.length === 0) {
      setRestaurantOptions([{ id: Date.now(), name: '' }]);
    }
  }, [optionType, restaurantOptions.length, setRestaurantOptions]);

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
            onChangeOption={onChangeOption}
            errorMap={errorMap}
          />
        </Box>
      )}

      {optionType === 2 && (
        <>
          <TextField
            label="Voting Deadline *"
            type="datetime-local"
            value={voteDeadline}
            onChange={(e) => onChangeVoteDeadline(e.target.value)}
            error={!!errorMap.voteDeadline}
            helperText={errorMap.voteDeadline}
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
                  onClick={() => onRemoveOption(option.id)}
                  disabled={restaurantOptions.length === 1}
                >
                  <Delete />
                </IconButton>
              </Box>
              <RestaurantFieldsForm
                index={0}
                option={restaurantOptions[0] || {}}
                onChangeOption={onChangeOption}
                errorMap={errorMap}
              />
            </Box>
          ))}

          <Button variant="outlined" startIcon={<Add />} onClick={onAddOption}>
            Add Restaurant Option
          </Button>
        </>
      )}
    </Box>
  );
};

export default RestaurantOptionsModal;
