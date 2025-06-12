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
import { EventFormProps } from '../../types/EventFormProps';
import { EventDTO } from '../../types/EventDTO';

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



export default function EventForm({ users, creatorId, event, onSubmit }: EventFormProps) {
  const [eventName, setEventName] = useState('');
  const [description, setDescription] = useState('');
  const [participants, setParticipants] = useState<number[]>([]);
  const [errors, setErrors] = useState({ name: '', participants: '' });

  useEffect(() => {
    if (event) {
      setEventName(event.name);
      setDescription(event.description);
      setParticipants(event.participants);
    }
  }, [event]);

  const allParticipantIds = users.map((user) => user.id);
  const isAllSelected = participants.length === users.length && users.length > 0;

  const handleEventNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEventName(e.target.value);
    if (e.target.value.trim() !== '') {
      setErrors((prev) => ({ ...prev, name: '' }));
    }
  };

  const handleParticipantsChange = (event: SelectChangeEvent<typeof participants>) => {
    const value = event.target.value as number[];
    let updatedParticipants: number[];

    if (value.includes(-1)) {
      updatedParticipants = isAllSelected ? [] : allParticipantIds;
    } else {
      updatedParticipants = value;
    }

    setParticipants(updatedParticipants);

    if (updatedParticipants.length > 0) {
      setErrors((prev) => ({ ...prev, participants: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;
    const newErrors = { name: '', participants: '' };

    if (eventName.trim() === '') {
      newErrors.name = 'Event name is required';
      hasError = true;
    }

    if (participants.length === 0) {
      newErrors.participants = 'Please select at least one participant';
      hasError = true;
    }

    setErrors(newErrors);

    if (!hasError) {
      const eventData: EventDTO = {
        id: event?.id ?? 0, // id is required in EventDTO, 0 for create case
        name: eventName,
        description,
        participants,
        creatorId: creatorId!, // assuming creatorId is never null here
      };

      const isUpdate = !!event && !!event.id;
      onSubmit(eventData, isUpdate, event?.id);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: 24 }}>
      <TextField
        fullWidth
        label="Event Name *"
        value={eventName}
        onChange={handleEventNameChange}
        margin="normal"
        error={!!errors.name}
        helperText={errors.name}
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
          value={participants}
          onChange={handleParticipantsChange}
          input={<OutlinedInput label="Participants *" />}
          renderValue={(selected) =>
            selected
              .map(
                (id) =>
                  users.find((user) => user.id === id)?.firstName +
                  ' ' +
                  users.find((user) => user.id === id)?.lastName,
              )
              .join(', ')
          }
        >
          <MenuItem value={-1}>
            <Checkbox checked={isAllSelected} />
            <ListItemText primary="Select All" />
          </MenuItem>
          {users.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              <Checkbox checked={participants.includes(user.id)} />
              <ListItemText primary={`${user.firstName} ${user.lastName}`} />
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>{errors.participants}</FormHelperText>
      </FormControl>

      <Button type="submit" variant="contained" sx={formButtonStyle}>
        {event ? 'Save Changes' : 'Create Event'}
      </Button>
    </form>
  );
}
