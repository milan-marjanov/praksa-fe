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
  Box,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { CreateEventDto, UpdateEventDTO, EventFormProps } from '../../types/Event';
import { formButtonStyle } from '../../styles/CommonStyles';

export default function EventForm({ users, creator, event, onSubmit }: EventFormProps) {
  const [eventTitle, setEventTitle] = useState('');
  const [description, setDescription] = useState('');
  const [votingDeadline, setVotingDeadline] = useState(
    new Date().toISOString().slice(0, 16)
  );
  const [selectedParticipants, setSelectedParticipants] = useState<number[]>([]);
  const [errors, setErrors] = useState({ title: '', participants: '', votingDeadline: '' });
  const maxDescriptionChars = 1000;

  const isUpdate = !!event;

  useEffect(() => {
    if (event) {
      setEventTitle(event.title);
      setDescription(event.description);
      setSelectedParticipants(
        'participantIds' in event ? event.participantIds.filter((id) => id !== creator.id) : []
      );
    }
  }, [event, creator.id]);

  const selectableUsers = users.filter((u) => u.id !== creator.id);
  const allParticipantIds = selectableUsers.map((user) => user.id);
  const isAllSelected =
    selectedParticipants.length === selectableUsers.length && selectableUsers.length > 0;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEventTitle(e.target.value);
    if (e.target.value.trim()) setErrors((p) => ({ ...p, title: '' }));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= maxDescriptionChars) {
      setDescription(e.target.value);
    }
  };

  const handleDeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVotingDeadline(e.target.value);
    if (e.target.value) setErrors((p) => ({ ...p, votingDeadline: '' }));
  };

  const handleParticipantsChange = (e: SelectChangeEvent<typeof selectedParticipants>) => {
    const value = e.target.value as number[];
    let updated: number[];
    if (value.includes(-1)) {
      updated = isAllSelected ? [] : allParticipantIds;
    } else {
      updated = value;
    }
    setSelectedParticipants(updated);
    if (updated.length) setErrors((p) => ({ ...p, participants: '' }));
  };

  const validate = () => {
    const newErrors = { title: '', participants: '', votingDeadline: '' };
    let hasError = false;
    if (!eventTitle.trim()) {
      newErrors.title = 'Event title is required';
      hasError = true;
    }
    if (!votingDeadline) {
      newErrors.votingDeadline = 'Voting deadline is required';
      hasError = true;
    }
    if (selectedParticipants.length === 0) {
      newErrors.participants = 'Please select at least one participant';
      hasError = true;
    }
    setErrors(newErrors);
    return hasError;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) return;

    const allParticipantIdsWithCreator = selectedParticipants.includes(creator.id)
      ? selectedParticipants
      : [...selectedParticipants, creator.id];

    if (isUpdate) {
      const updateData: UpdateEventDTO = {
        title: eventTitle,
        description,
        participantIds: allParticipantIdsWithCreator,
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
        votingDeadline: new Date(votingDeadline).toISOString(),
        participantIds: allParticipantIdsWithCreator,
      };
      await onSubmit(createData, false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: 24 }}>
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
      </Box>

      <TextField
        fullWidth
        label="Voting Deadline *"
        type="datetime-local"
        value={votingDeadline}
        onChange={handleDeadlineChange}
        margin="normal"
        error={!!errors.votingDeadline}
        helperText={errors.votingDeadline}
        InputLabelProps={{ shrink: true }}
      />

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
                const u = users.find((u) => u.id === id)
                return u ? `${u.firstName} ${u.lastName}` : ''
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

      <Button type="submit" variant="contained" sx={formButtonStyle}>
        {isUpdate ? 'Save Changes' : 'Create Event'}
      </Button>
    </form>
  );
}
