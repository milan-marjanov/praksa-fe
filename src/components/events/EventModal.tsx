import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
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
import { CreateEventDto, UpdateEventDTO, EventModalProps } from '../../types/Event';

export type EventModalRef = {
  validate: () => { hasError: boolean };
};

const EventModal = forwardRef<EventModalRef, EventModalProps>(
  ({ users, creator, event, onSubmit }, ref) => {
    const [eventTitle, setEventTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedParticipants, setSelectedParticipants] = useState<number[]>([]);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const maxDescriptionChars = 255;
    const isUpdate = !!event;

    useEffect(() => {
      if (event) {
        setEventTitle(event.title);
        setDescription(event.description);
        setSelectedParticipants(
          'participantIds' in event ? event.participantIds.filter((id) => id !== creator.id) : [],
        );
      }
    }, [event, creator.id]);

    useImperativeHandle(ref, () => ({
      validate,
    }));

    const selectableUsers = users.filter((u) => u.id !== creator.id);
    const allParticipantIds = selectableUsers.map((user) => user.id);
    const isAllSelected =
      selectedParticipants.length === selectableUsers.length && selectableUsers.length > 0;

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEventTitle(e.target.value);
      if (e.target.value.trim() !== '') {
        setErrors((prev) => ({ ...prev, title: '' }));
      }
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.value.length <= maxDescriptionChars) {
        setDescription(e.target.value);
      }
    };

    const handleParticipantsChange = (event: SelectChangeEvent<typeof selectedParticipants>) => {
      const value = event.target.value as number[];
      let updated: number[];

      if (value.includes(-1)) {
        updated = isAllSelected ? [] : allParticipantIds;
      } else {
        updated = value;
      }

      setSelectedParticipants(updated);

      if (updated.length > 0) {
        setErrors((prev) => ({ ...prev, participants: '' }));
      }
    };

    const validate = () => {
      const newErrors = { title: '', participants: '' };
      let hasError = false;

      if (eventTitle.trim() === '') {
        newErrors.title = 'Event title is required';
        hasError = true;
      }

      if (selectedParticipants.length === 0) {
        newErrors.participants = 'Please select at least one participant';
        hasError = true;
      }
      setErrors(newErrors);
      return { hasError, newErrors };
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      const { hasError, newErrors } = validate();
      setErrors(newErrors);
      if (hasError) return;

      const allParticipantIds = selectedParticipants.includes(creator.id)
        ? selectedParticipants
        : [...selectedParticipants, creator.id];

      if (isUpdate) {
        const updateData: UpdateEventDTO = {
          title: eventTitle,
          description,
          participantIds: allParticipantIds,
          timeOptions: event?.timeOptions ?? [],
          restaurantOptions: event?.restaurantOptions ?? [],
        };
        await onSubmit(updateData, true);
      } else {
        const createData: CreateEventDto = {
          id: 0,
          title: eventTitle,
          description,
          creatorId: creator.id,
          participantIds: allParticipantIds,
        };
        await onSubmit(createData, false);
      }
    };

    return (
      <Box
        display="flex"
        width="100%"
        sx={{
          backgroundColor: '#f5f5dc',
          p: 1,
        }}
        
      >
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            fullWidth
            label="Event Title *"
            value={eventTitle}
            onChange={handleTitleChange}
            sx={{ mt: 0, mb: 1 }}
            error={!!errors.title}
            helperText={errors.title}
          />

          <Box position="relative">
            <TextField
              fullWidth
              label="Event Description (optional)"
              value={description}
              onChange={handleDescriptionChange}
              margin="normal"
              multiline
              rows={3}
              inputProps={{ maxLength: maxDescriptionChars }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                position: 'absolute',
                bottom: 8,
                right: 16,
                userSelect: 'none',
              }}
            >
              {description.length}/{maxDescriptionChars}
            </Typography>
          </Box>

          <FormControl fullWidth margin="normal" error={!!errors.participants}>
            <InputLabel id="participants-label">Participants *</InputLabel>
            <Select
              labelId="participants-label"
              multiple
              value={selectedParticipants}
              onChange={handleParticipantsChange}
              input={<OutlinedInput label="Participants *" />}
              renderValue={(selected) =>
                selected
                  .map((id) => {
                    const user = users.find((u) => u.id === id);
                    return user ? `${user.firstName} ${user.lastName}` : '';
                  })
                  .join(', ')
              }
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: '#f5f5dc', // same color as the form
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
                  <Checkbox checked={selectedParticipants.includes(user.id)} />
                  <ListItemText primary={`${user.firstName} ${user.lastName}`} />
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.participants}</FormHelperText>
          </FormControl>
        </form>
      </Box>
    );
  },
);
export default EventModal;
