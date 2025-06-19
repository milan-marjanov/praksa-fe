import React from 'react';
import { Box, TextField, IconButton, Button, Typography } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { RestaurantOption } from './RestaurantOptionsForm';

interface RestaurantOptionsFormProps {
  votingEnabled: boolean;
  onVotingToggle: () => void;
  restaurantOptions: RestaurantOption[];
  onAddOption: () => void;
  onRemoveOption: (id: number) => void;
  onChangeOption: (id: number, field: keyof RestaurantOption, value: string) => void;
  voteDeadline: string;
  onChangeVoteDeadline: (value: string) => void;
  errorMap?: Record<string, string>;
  eventStartTime?: string;
}

const RestaurantOptionsModal: React.FC<RestaurantOptionsFormProps> = ({
  votingEnabled,
  onVotingToggle,
  restaurantOptions,
  onAddOption,
  onRemoveOption,
  onChangeOption,
  voteDeadline,
  onChangeVoteDeadline,
  errorMap = {},
}) => {
  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Button variant="outlined" onClick={onVotingToggle}>
        {votingEnabled ? 'Disable Restaurant Voting' : 'Enable Restaurant Voting'}
      </Button>

      {votingEnabled && (
        <>
          <TextField
            label="Voting Deadline *"
            type="datetime-local"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={voteDeadline}
            onChange={(e) => onChangeVoteDeadline(e.target.value)}
            error={!!errorMap.voteDeadline}
            helperText={errorMap.voteDeadline}
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
                <IconButton onClick={() => onRemoveOption(option.id)}>
                  <Delete />
                </IconButton>
              </Box>
              <TextField
                required
                label="Restaurant Name"
                fullWidth
                value={option.name}
                onChange={(e) => onChangeOption(option.id, 'name', e.target.value)}
                error={!!errorMap[`restaurant-${i}-name`]}
                helperText={errorMap[`restaurant-${i}-name`]}
              />
              <TextField
                label="Menu Image URL (optional)"
                fullWidth
                value={option.menuImageUrl || ''}
                onChange={(e) => onChangeOption(option.id, 'menuImageUrl', e.target.value)}
              />
              <TextField
                label="Restaurant Website (optional)"
                fullWidth
                value={option.restaurantUrl || ''}
                onChange={(e) => onChangeOption(option.id, 'restaurantUrl', e.target.value)}
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
