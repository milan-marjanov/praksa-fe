import { useEffect, useState } from 'react';
import { Container, Typography } from '@mui/material';
import { getAllUsers } from '../../services/userService';
import { User } from '../../types/User';
import { decodeJwt } from '../../services/authService';
import EventForm from '../../components/events/EventForm';
import { EventDTO } from '../../types/EventDTO';

export default function CreateEventPage() {
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
      .then((data) => setUsers(data))
      .catch((err) => console.error('Failed to fetch users', err))
      .finally(() => setLoading(false));
  }, []);

  const handleCreateEvent = (eventData: EventDTO, isUpdate: boolean) => {
    if (isUpdate) {
      // Should not happen on this page
      console.warn('Update attempted on create page, ignoring.');
      return;
    }

    console.log('Creating event with data:', eventData);
    // Example: call create API here
    // createEvent(eventData).then(() => navigate('/events'));
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ marginTop: 5, textAlign: 'center' }}>
        <Typography>Loading users...</Typography>
      </Container>
    );
  }

  const filteredUsers = users.filter((user) => user.id !== creatorId);

  return (
    <Container
      maxWidth="sm"
      sx={{ marginTop: 5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Typography component="h1" variant="h5" gutterBottom>
        Create New Event
      </Typography>
      <EventForm users={filteredUsers} creatorId={creatorId} onSubmit={handleCreateEvent} />
    </Container>
  );
}
