import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  OutlinedInput,
  Checkbox,
  ListItemText,
  FormHelperText,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { getAllUsers } from '../services/userService';
import { User } from '../types/User';
import { decodeJwt } from '../services/authService';

const createEventButtonStyle = {
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

export default function CreateEventPage() {
  const [eventName, setEventName] = useState('');
  const [description, setDescription] = useState('');
  const [participants, setParticipants] = useState<number[]>([]);
  const [errors, setErrors] = useState({ name: '', participants: '' });
  const [users, setUsers] = useState<User[]>([]);
  const [creatorId, setCreatorId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const decoded = decodeJwt(token);
        setCreatorId(decoded.id);
      } catch (err) {
        console.error('Failed to decode JWT token', err);
      }
    }

    getAllUsers()
      .then((data) => {
        setUsers(data);
      })
      .catch((err) => {
        console.error('Failed to fetch users', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredUsers = users.filter((user) => user.id !== creatorId);
  const allParticipantIds = filteredUsers.map((user) => user.id);
  const isAllSelected = participants.length === filteredUsers.length && filteredUsers.length > 0;

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
      const eventData = {
        name: eventName,
        description,
        participants,
        creatorId,
      };
      console.log('Event data:', eventData);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ marginTop: 5, textAlign: 'center' }}>
        <Typography>Loading users...</Typography>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="sm"
      sx={{ marginTop: 5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Typography component="h1" variant="h5">
        Create New Event
      </Typography>

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
                .map((id) =>
                  filteredUsers.find((user) => user.id === id)
                    ? `${filteredUsers.find((user) => user.id === id)!.firstName} ${filteredUsers.find((user) => user.id === id)!.lastName}`
                    : '',
                )
                .join(', ')
            }
          >
            <MenuItem
              value={-1}
              sx={{
                backgroundColor: '#f0f0f0',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#e0e0e0',
                },
              }}
            >
              <Checkbox checked={isAllSelected} />
              <ListItemText primary="Select All" />
            </MenuItem>
            {filteredUsers.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                <Checkbox checked={participants.includes(user.id)} />
                <ListItemText primary={`${user.firstName} ${user.lastName}`} />
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{errors.participants}</FormHelperText>
        </FormControl>

        <Button type="submit" variant="contained" sx={createEventButtonStyle}>
          Create Event
        </Button>
      </form>
    </Container>
  );
}
