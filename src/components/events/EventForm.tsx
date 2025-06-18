import React, { useEffect, useState } from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Button,
  FormHelperText,
  Typography,
  Box,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { CreateEventDto, UpdateEventDTO, EventFormProps, TimeOption } from '../../types/Event';
import TimeOptionsForm from './TimeOptionsForm';

export default function EventForm({ users, creator, event, onSubmit }: EventFormProps) {
  const [eventTitle, setEventTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState<number[]>([]);
  const [errors, setErrors] = useState({ title: '', participants: '' });
  const maxDescriptionChars = 255;

  const isUpdate = !!event;
  const [timeOptions, setTimeOptions] = useState<TimeOption[]>([]);
  const [votingDeadline, setVotingDeadline] = useState<string | undefined>(undefined);

  const handleTimeOptionsSubmit = (options: TimeOption[], deadline?: string) => {
    setTimeOptions(options);
    setVotingDeadline(deadline);
  };
  useEffect(() => {
    if (event) {
      setEventTitle(event.title);
      setDescription(event.description);
      setSelectedParticipants(
        'participantIds' in event ? event.participantIds.filter((id) => id !== creator.id) : [],
      );
    }
  }, [event, creator.id]);

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
        console.log("Event time options:", timeOptions);
    console.log("Voting deadline:", votingDeadline);
  };

  return (
    <Box
  display="flex"
  flexDirection="column"
  width="100vw"
  px={{ xs: 2, md: 6 }}
  py={4}
  gap={4}
  boxSizing="border-box"
>
  {/* Top Row: Two Columns */}
  <Box
    display="flex"
    flexDirection={{ xs: 'column', md: 'row' }}
    gap={4}
  >
    {/* Left: Event Details Form */}
    <Box
      flex={1}
      sx={{
        backgroundColor: 'background.paper',
        borderRadius: 2,
        boxShadow: 2,
        p: 3,
      }}
    >
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <TextField
          fullWidth
          label="Event Title *"
          value={eventTitle}
          onChange={handleTitleChange}
          margin="normal"
          error={!!errors.title}
          helperText={errors.title}
        />

        <Box position="relative" width="100%">
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

    {/* Right: Time Options Form */}
    <Box
      flex={1}
      sx={{
        backgroundColor: 'background.paper',
        borderRadius: 2,
        boxShadow: 2,
        p: 3,
      }}
    >
      <TimeOptionsForm onSubmit={handleTimeOptionsSubmit} />
    </Box>
  </Box>

  {/* Centered Button Below Both Forms */}
  <Box display="flex" justifyContent="center">
    <Button type="submit" variant="contained" onClick={handleSubmit}>
      {isUpdate ? 'Save Changes' : 'Create Event'}
    </Button>
  </Box>
</Box>


  );
}
