import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Box, Button, FormControlLabel, Radio, Typography, useMediaQuery } from '@mui/material';
import TimeOptionFieldsForm from './TimeOptionFieldsForm';
import { Add } from '@mui/icons-material';
import { useEventForm } from '../../contexts/EventContext';
import { EventModalRef } from '../../types/Event';
import { timeOptionsForm, timeOptionsTitleStyle } from '../../styles/EventModalStyles';
import { generateId, isValidFutureDate, validateStartEndTimes } from '../../utils/DateTimeUtils';
import { initialTimeOption } from '../../utils/EventDefaults';
import theme from '../../theme';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
const TimeOptionsModal = forwardRef<EventModalRef, {}>((_props, ref) => {
  const { eventData, setEventData } = useEventForm();
  const timeOptions = eventData.timeOptions;
  const [validationErrors, setValidationErrors] = useState<Record<number | string, string>>({});
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));

  const [optionType, setOptionType] = useState<1 | 2 | 3>(() => {
    switch (eventData.timeOptionType) {
      case 'FIXED':
        return 1;
      case 'VOTING':
        return 2;
      case 'CAPACITY_BASED':
        return 3;
      default:
        return 1;
    }
  });

  useEffect(() => {
    setValidationErrors({});
  }, [optionType]);

  useEffect(() => {
    setValidationErrors((prevErrors) => {
      const newErrors = Object.fromEntries(
        Object.entries(prevErrors).filter(([key]) => key !== 'invalidOptions'),
      );
      return newErrors;
    });
  }, [eventData.timeOptions?.length]);

  const validateTimeOptions = (timeOptions: typeof eventData.timeOptions, now: Date) => {
    const errors: Record<string | number, string> = {};
    let hasError = false;

    timeOptions?.forEach((option, index) => {
      const optionNumber = index + 1;

      if (!option.startTime || !option.endTime) {
        errors[option.id] = `Option ${optionNumber}: Both start and end times are required.`;
        hasError = true;
      }

      if (!isValidFutureDate(option.startTime, now)) {
        hasError = true;
      }

      if (!isValidFutureDate(option.endTime, now)) {
        hasError = true;
      }
      const startEndError = validateStartEndTimes(option.startTime, option.endTime);
      if (startEndError) {
        hasError = true;
      }
      if (
        optionType === 3 &&
        (option.maxCapacity === undefined ||
          option.maxCapacity === null ||
          option.maxCapacity.toString() === '')
      ) {
        errors[`maxCapacity-${option.id}`] = `Option ${optionNumber}: Max capacity is required.`;
        hasError = true;
      }
    });

    return { hasError, errors };
  };

  const validate = () => {
    const now = new Date();
    const errors: Record<string | number, string> = {};
    let hasError = false;

    const timeOptions = eventData?.timeOptions ?? [];
    if (timeOptions.length === 0) {
      errors['noOptions'] = 'No time options provided.';
      hasError = true;
    } else {
      const { hasError: timeOptionsHaveErrors, errors: timeOptionErrors } = validateTimeOptions(
        timeOptions,
        now,
      );
      if (timeOptionsHaveErrors) {
        hasError = true;
        Object.assign(errors, timeOptionErrors);
      }
    }

    if (optionType === 2 || optionType === 3) {
      if (timeOptions.length < 2 || timeOptions.length > 6) {
        errors['invalidOptions'] = 'Number of time options must be between 2 and 6.';

        hasError = true;
      }
    }

    setValidationErrors(errors);

    return { hasError, errors };
  };

  useImperativeHandle(ref, () => ({
    validate,
  }));

  useEffect(() => {
    if (eventData.timeOptions?.length === 0) {
      const newOption = {
        ...initialTimeOption,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };

      setEventData({
        timeOptions: [newOption],
      });
    }

    console.log(eventData);
  }, [optionType, eventData.timeOptions, setEventData, eventData]);

  const handleOptionTypeChange = (value: 1 | 2 | 3) => {
    const typeMap = {
      1: 'FIXED',
      2: 'VOTING',
      3: 'CAPACITY_BASED',
    } as const;

    setOptionType(value);

    setEventData({
      ...eventData,
      timeOptionType: typeMap[value],
      timeOptions: [initialTimeOption],
    });
  };

  const addOption = () => {
    if ((eventData.timeOptions?.length ?? 0) >= 6) return;

    const newOption = {
      ...initialTimeOption,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };

    setEventData({
      timeOptions: [...(eventData.timeOptions || []), newOption],
    });
  };

  const removeOption = (id: number) => {
    const updatedOptions = (timeOptions ?? []).filter((opt) => opt.id !== id);

    setEventData({
      timeOptions: updatedOptions,
    });

    const now = new Date();
    const { errors } = validateTimeOptions(updatedOptions, now);
    setValidationErrors(errors);
  };

  const updateOption = (
    id: number,
    field: 'startTime' | 'endTime' | 'maxCapacity',
    value: string,
  ) => {
    const updatedOptions = (timeOptions ?? []).map((opt) =>
      opt.id === id
        ? {
            ...opt,
            [field]: value,
          }
        : opt,
    );

    setEventData({ timeOptions: updatedOptions });

    setValidationErrors((prev) => {
      const newErrors: Record<string | number, string> = {};

      Object.entries(prev).forEach(([key, val]) => {
        const shouldRemove =
          (field === 'maxCapacity' && key === `maxCapacity-${id}`) ||
          (field !== 'maxCapacity' && key === String(id));

        if (!shouldRemove) {
          newErrors[key] = val;
        }
      });

      return newErrors;
    });
  };

  return (
    <Box component="form" style={timeOptionsForm}>
      <Box display="flex" flexDirection="column" gap={3} marginLeft={1}>
        <Typography variant="subtitle1" fontWeight="bold">
          Choose How You Want to Schedule Your Event
        </Typography>
        <Box display="flex" flexDirection="column">
          <FormControlLabel
            control={
              <Radio
                checked={optionType === 1}
                onChange={() => handleOptionTypeChange(1)}
                value={1}
              />
            }
            label="Schedule One Specific Time"
          />
          <FormControlLabel
            control={
              <Radio
                checked={optionType === 2}
                onChange={() => handleOptionTypeChange(2)}
                value={2}
              />
            }
            label="Let Participants Vote on the Best Time (Up to 6 options)"
          />
          <FormControlLabel
            control={
              <Radio
                checked={optionType === 3}
                onChange={() => handleOptionTypeChange(3)}
                value={3}
              />
            }
            label="Create Multiple Time Slots with Capacity Limits"
          />
        </Box>
      </Box>

      <hr style={{ margin: '16px 0' }} />
      {optionType === 1 && eventData.timeOptions && eventData.timeOptions[0] && (
        <TimeOptionFieldsForm
          key={eventData.timeOptions[0].id}
          opt={eventData.timeOptions[0]}
          index={0}
          optionType={optionType}
          updateOption={updateOption}
          removeOption={() => {}}
          multipleOptionsLength={1}
        />
      )}

      {(optionType === 2 || optionType === 3) && (
        <>
          <Typography
            sx={{
              ...timeOptionsTitleStyle,
              fontSize: isSm ? '0.985rem' : '1rem',
            }}
          >
            Time Options (You can add up to 6)
          </Typography>
          {(eventData.timeOptions || []).map((opt, i) => (
            <TimeOptionFieldsForm
              key={opt.id}
              opt={opt}
              index={i}
              optionType={optionType}
              updateOption={updateOption}
              removeOption={removeOption}
              multipleOptionsLength={(eventData.timeOptions || []).length}
            />
          ))}

          <Box textAlign="center" mt={2}>
            <Button
              variant="outlined"
              sx={{ width: '70%' }}
              startIcon={<Add />}
              onClick={addOption}
              disabled={(eventData.timeOptions?.length ?? 0) >= 6}
            >
              Add Time Option
            </Button>
          </Box>
        </>
      )}

      {Object.keys(validationErrors).length > 0 && (
        <Box sx={{ color: 'red', mt: 2, ml: 2 }}>
          {Object.entries(validationErrors).map(([key, error]) => (
            <Typography key={key} variant="body2">
              • {error}
            </Typography>
          ))}
        </Box>
      )}
    </Box>
  );
});

export default TimeOptionsModal;
