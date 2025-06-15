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
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { CreateEventDto, UpdateEventDTO, EventFormProps } from '../../types/Event';

const formButtonStyle = {
  mt: 3,
  mb: 2,
  width: 300,
  mx: 'auto',
  backgroundColor: 'primary.main',
  '&:hover': {
    backgroundColor: 'secondary.main',
  },
  fontWeight: 'bold',
};

export default function EventForm({ users, creator, event, onSubmit }: EventFormProps) {
  const [eventTitle, setEventTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState<number[]>([]);
  const [errors, setErrors] = useState({ title: '', participants: '' });

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
        timeOptions: 'timeOptions' in event ? event.timeOptions : [],
        restaurantOptions: 'restaurantOptions' in event ? event.restaurantOptions : [],
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

      <TextField
        fullWidth
        label="Event Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        margin="normal"
        multiline
        rows={3}
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

      <Button type="submit" variant="contained" sx={formButtonStyle}>
        {isUpdate ? 'Save Changes' : 'Create Event'}
      </Button>
    </form>
  );
}
