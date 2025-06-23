import { useState, useMemo } from 'react';
import { Box, Typography, TextField, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { TimeOption } from '../../types/Event';

type TimeOptionFormProps = {
  opt: TimeOption;
  index: number;
  optionType: number;
  updateOption: (id: number, field: 'startTime' | 'endTime' | 'maxCapacity', value: string) => void;
  removeOption: (id: number) => void;
  multipleOptionsLength: number;
};

export default function TimeOptionFieldsForm({
  opt,
  index,
  optionType,
  updateOption,
  removeOption,
  multipleOptionsLength,
}: TimeOptionFormProps) {
  const [errors, setErrors] = useState<{ startTime?: string; endTime?: string }>({});

  const tomorrowMidnightISO = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.toISOString().slice(0, 16);
  }, []);

  function validateDateTime(value: string): string | null {
    if (!value) return 'This field is required.';
    const date = new Date(value);
    if (isNaN(date.getTime())) return 'Invalid date/time format.';
    const now = new Date();
    now.setSeconds(0, 0);
    if (date < now) return 'Date/time cannot be in the past.';
    return null;
  }

  function validateStartEndTimes(start: string, end: string): string | null {
    if (!start || !end) return null;
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (endDate <= startDate) return 'End Time must be after Start Time.';
    return null;
  }

  function handleStartTimeChange(value: string) {
    updateOption(opt.id, 'startTime', value);

    const error = validateDateTime(value);
    setErrors((prev) => ({ ...prev, startTime: error || undefined }));

    if (!error) {
      const crossError = validateStartEndTimes(value, opt.endTime);
      setErrors((prev) => ({ ...prev, endTime: crossError || undefined }));
    }
  }

  function handleEndTimeChange(value: string) {
    updateOption(opt.id, 'endTime', value);

    const error = validateDateTime(value);
    setErrors((prev) => ({ ...prev, endTime: error || undefined }));

    if (!error) {
      const crossError = validateStartEndTimes(opt.startTime, value);
      setErrors((prev) => ({ ...prev, endTime: crossError || undefined }));
    }
  }

  function handleMaxCapacityChange(id: number, value: string) {
    if (value === '' || Number(value) > 0) {
      updateOption(id, 'maxCapacity', value);
    }
  }

  return (
    <Box sx={{ mb: 3, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
      {multipleOptionsLength > 0 && (
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="subtitle1">Option {index + 1}</Typography>
          <IconButton
            onClick={() => removeOption(opt.id)}
            disabled={multipleOptionsLength === 1}
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      )}

      <Box display="flex" gap={2} flexWrap="wrap">
        <Box flex={1} minWidth={200}>
          <Typography sx={{ ml: 0.75, fontSize: 14, color: '#555', mb: 0.5, fontWeight: '600' }}>
            Start Time
          </Typography>
          <TextField
            fullWidth
            type="datetime-local"
            value={opt.startTime}
            onChange={(e) => handleStartTimeChange(e.target.value)}
            required
            error={!!errors.startTime}
            helperText={errors.startTime || ' '}
            inputProps={{ min: tomorrowMidnightISO }}
          />
        </Box>

        <Box flex={1} minWidth={200}>
          <Typography sx={{ ml: 0.75, fontSize: 14, color: '#555', mb: 0.5, fontWeight: '600' }}>
            End Time
          </Typography>
          <TextField
            fullWidth
            type="datetime-local"
            value={opt.endTime}
            onChange={(e) => handleEndTimeChange(e.target.value)}
            required
            error={!!errors.endTime}
            helperText={errors.endTime || ' '}
            inputProps={{ min: tomorrowMidnightISO }}
          />
        </Box>
      </Box>

      {optionType === 3 && (
        <Box mt={3} width="45%" textAlign="center" mx="auto">
          <Typography sx={{ ml: 0.75, fontSize: 14, color: '#555', mb: 0.5, fontWeight: '600' }}>
            Max Participants Allowed
          </Typography>
          <TextField
            fullWidth
            type="number"
            value={opt.maxCapacity ?? ''}
            onChange={(e) => handleMaxCapacityChange(opt.id, e.target.value)}
            required
          />
          <Typography sx={{ color: '#777', fontSize: 10, mt: 1, ml: 1 }}>
            Limit how many people can join at this time
          </Typography>
        </Box>
      )}
    </Box>
  );
}
