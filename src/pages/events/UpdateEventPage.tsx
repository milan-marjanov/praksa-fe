import { useEffect, useState } from 'react';
import { Container, Typography } from '@mui/material';
import { getAllUsers } from '../../services/userService';
import { User } from '../../types/User';
import { decodeJwt } from '../../services/authService';
import EventForm from '../../components/events/EventForm'; // Adjust path if needed
import { EventDTO } from '../../types/EventDTO';

const mockEvent: EventDTO = {
  id: 1,
  name: 'Team Building Workshop',
  description: 'A collaborative event to strengthen team dynamics.',
  participants: [1, 2],
  creatorId: 0, // You can set a default here, will be overwritten below
};

export default function UpdateEventPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [creatorId, setCreatorId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [eventData, setEventData] = useState<EventDTO | null>(null);

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

    // Simulate fetching event data, here using mockEvent
    setEventData(mockEvent);
  }, []);

  const handleUpdateEvent = (updatedEventData: EventDTO, isUpdate: boolean) => {
    if (!isUpdate) {
      console.warn('Create attempted on update page, ignoring.');
      return;
    }
    console.log('Updating event with data:', updatedEventData);
    // Example: call update API here, e.g.
    // updateEvent(eventId!, updatedEventData).then(() => navigate('/events'));
  };

  if (loading || !eventData || creatorId === null) {
    return (
      <Container maxWidth="sm" sx={{ marginTop: 5, textAlign: 'center' }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  const filteredUsers = users.filter((user) => user.id !== creatorId);

  // Inject the correct creatorId into eventData
  const eventWithCreator = { ...eventData, creatorId };

  return (
    <Container
      maxWidth="sm"
      sx={{ marginTop: 5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Typography component="h1" variant="h5" gutterBottom>
        Edit Event
      </Typography>
      <EventForm
        users={filteredUsers}
        creatorId={creatorId}
        event={eventWithCreator}
        onSubmit={handleUpdateEvent}
      />
    </Container>
  );
}
