import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Box, IconButton, Button, Typography, FormControlLabel, Radio } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import RestaurantFieldsForm from './RestaurantFieldsForm';
import { EventModalRef, RestaurantOption } from '../../types/Event';
import { useEventForm } from '../../contexts/EventContext';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
const RestaurantOptionsModal = forwardRef<EventModalRef, {}>((_props, ref) => {
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

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if ((!restaurantOptions || restaurantOptions.length === 0) && optionType !== 3) {
      setEventData({
        restaurantOptions: [{ id: Date.now(), name: '' }],
      });
    }
  }, [eventData, optionType, restaurantOptions, setEventData]);

  useEffect(() => {
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };

      if (restaurantOptions) {
        restaurantOptions.forEach((opt) => {
          if (opt.name && opt.name.trim() !== '') {
            delete newErrors[opt.id];
          }
        });
      }

      return newErrors;
    });
  }, [restaurantOptions?.map((opt) => opt.name).join('|')]);

  useEffect(() => {
    setErrors({});
  }, [optionType]);

  useEffect(() => {
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors['invalidOptions'];
      return newErrors;
    });
  }, [eventData.restaurantOptions?.length]);

  useImperativeHandle(ref, () => ({
    validate,
  }));

  const validate = () => {
    const newErrors: Record<number | string, string> = {};
    let hasError = false;

    if (optionType === 1 || optionType === 2) {
      for (let i = 0; i < (eventData.restaurantOptions?.length ?? 0); i++) {
        const opt = eventData.restaurantOptions![i];
        if (!opt.name || opt.name.trim() === '') {
          newErrors[opt.id] = 'Restaurant name is required';
          hasError = true;
        }
      }
    }
    if (optionType === 2) {
      if (
        eventData.restaurantOptions &&
        (eventData.restaurantOptions.length < 2 || eventData.restaurantOptions.length > 6)
      ) {
        newErrors['invalidOptions'] = 'Number of restaurant options must be between 2 and 6.';
        hasError = true;
      }
    }

    setErrors(newErrors);

    return { hasError, newErrors };
  };

  const handleAddRestaurantOption = () => {
    setEventData({
      restaurantOptions: [...(restaurantOptions || []), { id: Date.now(), name: '' }],
    });
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

  return (
    <Box display="flex" flexDirection="column" gap={3} marginLeft={1}>
      <Box>
        <Typography variant="subtitle1" fontWeight="bold">
          Select Restaurant Option Type
        </Typography>
        <Box display="flex" flexDirection="column" mt={1}>
          <FormControlLabel
            control={
              <Radio
                checked={optionType === 1}
                onChange={() => handleOptionTypeChange(1)}
                value={1}
              />
            }
            label="Choose One Restaurant"
          />
          <FormControlLabel
            control={
              <Radio
                checked={optionType === 2}
                onChange={() => handleOptionTypeChange(2)}
                value={2}
              />
            }
            label="Let Participants Vote on Restaurants"
          />
          <FormControlLabel
            control={
              <Radio
                checked={optionType === 3}
                onChange={() => handleOptionTypeChange(3)}
                value={3}
              />
            }
            label="Skip Restaurant Selection"
          />
        </Box>
      </Box>

      {optionType === 1 && restaurantOptions?.[0] && (
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
            option={restaurantOptions[0]}
            onChangeOption={handleRestaurantOptionChange}
          />
          {errors[restaurantOptions[0].id] && (
            <Box style={{ color: 'red', fontSize: '0.8em', marginLeft: 8 }}>
              {errors[restaurantOptions[0].id]}
            </Box>
          )}
        </Box>
      )}

      {optionType === 2 && (
        <>
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
              marginTop="-15px"
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
              {errors[option.id] && (
                <Box style={{ color: 'red', fontSize: '0.8em', marginLeft: 8 }}>
                  {errors[option.id]}
                </Box>
              )}
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
      {errors['invalidOptions'] && (
        <Box style={{ color: 'red', fontSize: '0.8em', marginLeft: 8, marginTop: 6 }}>
          • {errors['invalidOptions']}
        </Box>
      )}
    </Box>
  );
});

export default RestaurantOptionsModal;
