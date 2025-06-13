import { Container, Typography } from '@mui/material';
import EventForm from '../../components/events/EventForm';
import { EventDTO } from '../../types/Event';
import { containerStyle } from '../../styles/CommonStyles';
import { useSetupEventForm } from '../../hooks/UseEventForm';

export default function CreateEventPage() {
  const { creatorId, users, loading } = useSetupEventForm();

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
    <Container maxWidth="sm" sx={{ ...containerStyle, marginTop: 5 }}>
      <Typography component="h1" variant="h5" gutterBottom>
        Create New Event
      </Typography>
      <EventForm users={filteredUsers} creatorId={creatorId} onSubmit={handleCreateEvent} />
    </Container>
  );
}
