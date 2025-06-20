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
  function handleMaxCapacityChange(id: number, value: string) {
    // Allow empty value (to clear field) or only numbers > 0
    if (value === '' || Number(value) > 0) {
      updateOption(id, 'maxCapacity', value);
    }
  }
  return (
    <Box sx={{ mb: 3, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
      {multipleOptionsLength > 0 && (
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
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
          <Typography style={{ marginLeft:6,     fontSize: 14,
    color: '#555',
    marginBottom: 4,
    fontWeight: '600', }}>Start Time</Typography>
          <TextField
            fullWidth
            type="datetime-local"
            value={opt.startTime}
            onChange={(e) => updateOption(opt.id, 'startTime', e.target.value)}
            required
          />
        </Box>

        <Box flex={1} minWidth={200}>
          <Typography style={{ marginLeft:6,     fontSize: 14,
    color: '#555',
    marginBottom: 4,
    fontWeight: '600', }}>End Time</Typography>
          <TextField
            fullWidth
            type="datetime-local"
            value={opt.endTime}
            onChange={(e) => updateOption(opt.id, 'endTime', e.target.value)}
            required
          />
        </Box>
      </Box>

      {optionType === 3 && (
        <Box mt={3} width="45%" textAlign="center" mx="auto">
          <Typography style={{ marginLeft:6,     fontSize: 14,
    color: '#555',
    marginBottom: 4,
    fontWeight: '600', }}>Max Participants Allowed</Typography>
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
