import React, { forwardRef, useImperativeHandle, useState } from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
  FormHelperText,
  Typography,
  Box,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { EventModalProps, EventModalRef, ParticipantDto } from '../../../types/Event';
import { useEventForm } from '../../../contexts/EventContext';
import { eventDescriptionStyle, eventModalContainerStyle } from '../../../styles/EventModalStyles';
import { maxDescriptionChars } from '../../../utils/EventDefaults';

const EventModal = forwardRef<EventModalRef, EventModalProps>(({ users, creator }, ref) => {
  const { eventData, setEventData } = useEventForm();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useImperativeHandle(ref, () => ({
    validate,
  }));

  const selectableUsers = users.filter((u) => u.id !== creator.id);
  const allParticipantIds = selectableUsers.map((user) => user.id);
  const isAllSelected =
    eventData.participantIds?.length === selectableUsers.length && selectableUsers.length > 0;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEventData({ title: e.target.value });
    if (e.target.value.trim() !== '') {
      setErrors((prev) => ({ ...prev, title: '' }));
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= maxDescriptionChars) {
      setEventData({ description: e.target.value });
    }
  };

  const handleParticipantsChange = (event: SelectChangeEvent<number[]>) => {
    const value = event.target.value as number[];
    let updated: number[];

    if (value.includes(-1)) {
      updated = isAllSelected ? [] : allParticipantIds;
    } else {
      updated = value;
    }

    setEventData({ participantIds: updated });

    if (updated.length > 0) {
      setErrors((prev) => ({ ...prev, participants: '' }));
    }
  };
  useImperativeHandle(ref, () => ({
    validate: () => {
      const newErrors = { title: '', participants: '' };
      let hasError = false;

      if (!eventData.title?.trim()) {
        newErrors.title = 'Event title is required';
        hasError = true;
      }

      if (!eventData.participantIds || eventData.participantIds.length === 0) {
        newErrors.participants = 'Please select at least one participant';
        hasError = true;
      }

      setErrors(newErrors);
      return { hasError, newErrors };
    },
  }));

  const validate = () => {
    const newErrors = { title: '', participants: '' };
    let hasError = false;

    if (!eventData.title?.trim()) {
      newErrors.title = 'Event title is required';
      hasError = true;
    }

    if (!eventData.participantIds || eventData.participantIds.length === 0) {
      newErrors.participants = 'Please select at least one participant';
      hasError = true;
    }

    setErrors(newErrors);
    return { hasError, newErrors };
  };

  const renderParticipantNames = (selected: number[], users: ParticipantDto[]): string => {
    return selected
      .map((id) => {
        const user = users.find((u) => u.id === id);
        return user ? `${user.firstName} ${user.lastName}` : '';
      })
      .join(', ');
  };

  return (
    <Box sx={{ eventModalContainerStyle }}>
      <Box component="form" style={{ width: '100%' }}>
        <TextField
          fullWidth
          label="Event Title *"
          value={eventData.title}
          onChange={handleTitleChange}
          sx={{ mt: 0, mb: 1 }}
          error={!!errors.title}
          helperText={errors.title}
        />

        <Box position="relative">
          <TextField
            fullWidth
            label="Event Description (optional)"
            value={eventData.description}
            onChange={handleDescriptionChange}
            margin="normal"
            multiline
            rows={6}
            inputProps={{ maxLength: maxDescriptionChars }}
          />
          <Typography variant="caption" color="text.secondary" sx={eventDescriptionStyle}>
            {eventData.description?.length ?? 0}/{maxDescriptionChars}
          </Typography>
        </Box>

        <FormControl fullWidth margin="normal" error={!!errors.participants}>
          <InputLabel id="participants-label">Participants *</InputLabel>
          <Select
            labelId="participants-label"
            multiple
            value={eventData.participantIds?.filter((id) => id !== creator.id) || []}
            onChange={handleParticipantsChange}
            input={<OutlinedInput label="Participants *" />}
            renderValue={(selected) => renderParticipantNames(selected as number[], users)}
            MenuProps={{
              PaperProps: {
                sx: {
                  backgroundColor: '#f5f5dc',
                },
              },
            }}
          >
            <MenuItem value={-1}>
              <Checkbox checked={isAllSelected} />
              <ListItemText primary="Select All" />
            </MenuItem>
            {selectableUsers.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                <Checkbox checked={eventData.participantIds?.includes(user.id)} />
                <ListItemText primary={`${user.firstName} ${user.lastName}`} />
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{errors.participants}</FormHelperText>
        </FormControl>
      </Box>
    </Box>
  );
});

export default EventModal;
