import { Container, Typography } from '@mui/material';
import EventForm from '../../components/events/EventForm';
import { EventDTO } from '../../types/Event';
import { containerStyle } from '../../styles/CommonStyles';
import { useSetupEventForm } from '../../hooks/UseEventForm';

const mockEvent: EventDTO = {
  id: 1,
  title: 'Team Building Workshop',
  description: 'A collaborative event to strengthen team dynamics.',
  participantIds: [1, 2],
  creatorId: 0,
};

export default function UpdateEventPage() {
  const { creatorId, users, loading, eventData } = useSetupEventForm(mockEvent);

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
      <Container sx={{ ...containerStyle, marginTop: 5 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  const filteredUsers = users.filter((user) => user.id !== creatorId);

  const eventWithCreator = { ...eventData, creatorId };

  return (
    <Container maxWidth="sm" sx={{ ...containerStyle, marginTop: 5 }}>
      <Typography variant="h5">Edit Event</Typography>
      <EventForm
        users={filteredUsers}
        creatorId={creatorId}
        event={eventWithCreator}
        onSubmit={handleUpdateEvent}
      />
    </Container>
  );
}
