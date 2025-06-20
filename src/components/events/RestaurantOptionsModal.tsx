import React, { useEffect, useState } from 'react';
import { Box, IconButton, Button, Typography, FormControlLabel, Radio } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import RestaurantFieldsForm from './RestaurantFieldsForm';
import { RestaurantOption } from '../../types/Event';
import DateTimeForm from './DateTimeForm';
import { useEventForm } from '../../contexts/EventContext';

const RestaurantOptionsModal: React.FC = () => {
  const { eventData, setEventData } = useEventForm();
  const restaurantOptions = eventData.restaurantOptions;

  const [optionType, setOptionType] = useState<1 | 2 | 3>(1);

  const [voteDeadline, setVoteDeadline] = useState('');

  useEffect(() => {
    console.log(eventData);
    if (optionType === 2 && (!restaurantOptions || restaurantOptions.length === 0)) {
      setEventData({
        restaurantOptions: [{ id: Date.now(), name: '' }],
      });
    }
  }, [eventData, optionType, restaurantOptions, setEventData]);

  const handleAddRestaurantOption = () => {
    setEventData({
      restaurantOptions: [...(restaurantOptions || []), { id: Date.now(), name: '' }],
    });
    console.log(voteDeadline);
  };

  const handleRemoveRestaurantOption = (id: number) => {
    setEventData({
      restaurantOptions: (restaurantOptions ?? []).filter((r) => r.id !== id),
    });
  };

  const handleRestaurantOptionChange = (
    id: number,
    field: keyof RestaurantOption,
    value: string,
  ) => {
    setEventData({
      restaurantOptions: (restaurantOptions ?? []).map((opt) =>
        opt.id === id ? { ...opt, [field]: value } : opt,
      ),
    });
  };

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
            option={(restaurantOptions ?? [{ id: Date.now(), name: '' }])[0]}
            onChangeOption={handleRestaurantOptionChange}
          />
        </Box>
      )}

      {optionType === 2 && (
        <>
          <DateTimeForm
            label="Voting Deadline"
            required
            onValidChange={(e) => setVoteDeadline(e)}
          />

          {(restaurantOptions ?? []).map((option, i) => (
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
                  disabled={(restaurantOptions ?? []).length === 1}
                >
                  <Delete />
                </IconButton>
              </Box>
              <RestaurantFieldsForm
                index={i}
                option={option}
                onChangeOption={handleRestaurantOptionChange}
              />
            </Box>
          ))}

          <Box textAlign="center">
            <Button
              variant="outlined"
              sx={{ width: '70%' }}
              startIcon={<Add />}
              onClick={handleAddRestaurantOption}
            >
              Add Restaurant Option
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default RestaurantOptionsModal;
