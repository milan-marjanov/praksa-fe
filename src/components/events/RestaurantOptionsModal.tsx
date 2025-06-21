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

  const [optionType, setOptionType] = useState<1 | 2 | 3>(() => {
    switch (eventData.restaurantOptionType) {
      case 'FIXED':
        return 1;
      case 'VOTING':
        return 2;
      case 'NONE':
        return 3;
      default:
        return 1;
    }
  });

  const votingDeadline = eventData.votingDeadline;

  useEffect(() => {
    console.log(eventData);
    if ((!restaurantOptions || restaurantOptions.length === 0) && optionType !== 3) {
      setEventData({
        restaurantOptions: [{ id: Date.now(), name: '' }],
      });
    }
  }, [eventData, optionType, restaurantOptions, setEventData]);

  const handleAddRestaurantOption = () => {
    setEventData({
      restaurantOptions: [...(restaurantOptions || []), { id: Date.now(), name: '' }],
    });
    console.log(votingDeadline);
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

  const handleOptionTypeChange = (value: 1 | 2 | 3) => {
    const typeMap = {
      1: 'FIXED',
      2: 'VOTING',
      3: 'NONE',
    } as const;

    const initialRestaurantOption = { id: Date.now(), name: '' };


    setOptionType(value);

    if (value === 3) {
    setEventData({
      ...eventData,
      restaurantOptionType: typeMap[value],
      restaurantOptions: [],
    });
    } else {
          setEventData({
      ...eventData,
      restaurantOptionType: typeMap[value],
      restaurantOptions: [initialRestaurantOption],
    });
    }

  };

  
  const handleVotingDeadlineChange = (newDeadline: string) => {

    setEventData({
      ...eventData,

    votingDeadline: newDeadline,
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
              <Radio checked={optionType === 1} onChange={() => handleOptionTypeChange(1)} value={1} />
            }
            label="Choose One Restaurant"
          />
          <FormControlLabel
            control={
              <Radio checked={optionType === 2} onChange={() => handleOptionTypeChange(2)} value={2} />
            }
            label="Let Participants Vote on Restaurants"
          />
          <FormControlLabel
            control={
              <Radio checked={optionType === 3} onChange={() => handleOptionTypeChange(3)} value={3} />
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
          <Typography
            style={{
              fontSize: 14,
              color: '#555',
              marginBottom: -10,
              marginLeft: 8,
              fontWeight: '600',
            }}
          >
            Voting Deadline
          </Typography>

          <DateTimeForm label="" required initialValue={votingDeadline}

                onValidChange={(e) => handleVotingDeadlineChange(e)} />

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
