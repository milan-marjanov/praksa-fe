import { Container, Typography } from '@mui/material';
import EventForm from '../../components/events/EventForm';
import { CreateEventDto, UpdateEventDTO } from '../../types/Event'; // Assuming UpdateEventDto is defined here
import { containerStyle } from '../../styles/CommonStyles';
import { useSetupEventForm } from '../../hooks/UseEventForm';
import { createEvent } from '../../services/eventService'; // Assuming updateEvent service exists
import { useNavigate } from 'react-router-dom';

export default function CreateEventPage() {
  const { creatorId, users, loading } = useSetupEventForm();
  const navigate = useNavigate();

  const handleSubmit = async (eventData: CreateEventDto | UpdateEventDTO, isUpdate: boolean) => {
    try {
      if (isUpdate) {
        // This page is for creation, so ignore updates here, but can log or throw if desired
        console.warn('Update attempted on CreateEventPage - ignoring');
        return;
      } else {
        // Create new event
        console.log('Creating event with data:', eventData);
        await createEvent(eventData as CreateEventDto);
        navigate('/events');
      }
    } catch (error) {
      console.error('Error submitting event:', error);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ marginTop: 5, textAlign: 'center' }}>
        <Typography>Loading users...</Typography>
      </Container>
    );
  }

  const creator = users.find((user) => user.id === creatorId);

  if (!creator) {
    return (
      <Container maxWidth="sm" sx={{ marginTop: 5, textAlign: 'center' }}>
        <Typography>Error: Creator not found.</Typography>
      </Container>
    );
  }

  // Pass filtered users without the creator (since they are always included)
  const filteredUsers = users.filter((user) => user.id !== creatorId);

  return (
    <Container maxWidth="sm" sx={{ ...containerStyle, marginTop: 5 }}>
      <Typography component="h1" variant="h5" gutterBottom>
        Create New Event
      </Typography>
      <EventForm users={filteredUsers} creator={creator} onSubmit={handleSubmit} />
    </Container>
  );
}
