import { useEffect, useState } from 'react';
import { Container, Typography } from '@mui/material';
import { getAllUsers } from '../services/userService';
import { User } from '../types/User';
import { decodeJwt } from '../services/authService';
import UpdateEventForm from '../components/UpdateEventForm';

const mockEvent = {
  id: 1,
  name: 'Team Building Workshop',
  description: 'A collaborative event to strengthen team dynamics.',
  participants: [1, 2],
};

export default function UpdateEventPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [creatorId, setCreatorId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [eventData, setEventData] = useState<typeof mockEvent | null>(null);

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

    setEventData(mockEvent);
  }, []);

  if (loading || !eventData) {
    return (
      <Container maxWidth="sm" sx={{ marginTop: 5, textAlign: 'center' }}>
        <Typography>Loading...</Typography>
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
        Edit Event
      </Typography>
      <UpdateEventForm
        users={filteredUsers}
        creatorId={creatorId}
        initialData={eventData}
      />
    </Container>
  );
}
