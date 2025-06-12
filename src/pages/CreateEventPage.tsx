import { useEffect, useState } from 'react';
import { Container, Typography } from '@mui/material';
import { getAllUsers } from '../services/userService';
import { User } from '../types/User';
import { decodeJwt } from '../services/authService';
import CreateEventForm from '../components/CreateEventForm';

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
      <Typography component="h1" variant="h5">
        Create New Event
      </Typography>
      <CreateEventForm users={filteredUsers} creatorId={creatorId} />
    </Container>
  );
}
