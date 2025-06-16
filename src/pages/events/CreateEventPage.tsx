import { Container, Typography } from '@mui/material';
import EventForm from '../../components/events/EventForm';
import { CreateEventDto, UpdateEventDTO } from '../../types/Event';
import { containerStyle } from '../../styles/CommonStyles';
import { UseSetupEventForm } from '../../hooks/UseSetupEventForm';
import { createEvent } from '../../services/eventService';
import { useNavigate } from 'react-router-dom';

export default function CreateEventPage() {
  const { creator, filteredUsers, loading } = UseSetupEventForm();
  const navigate = useNavigate();

  const handleSubmit = async (eventData: CreateEventDto | UpdateEventDTO, isUpdate: boolean) => {
    try {
      if (isUpdate) {
        console.warn('Update attempted on CreateEventPage - ignoring');
        return;
      } else {
        console.log('Creating event with data:', eventData);
        await createEvent(eventData as CreateEventDto);
        navigate('/createdEvents');
      }
    } catch (error) {
      console.error('Error submitting event:', error);
    }
  };

  if (loading || !creator) {
    return (
      <Container maxWidth="sm" sx={{ ...containerStyle, marginTop: 5 }}>
        <Typography>Loading users...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ ...containerStyle, marginTop: 5 }}>
      <Typography component="h1" variant="h5" gutterBottom>
        Create New Event
      </Typography>
      <EventForm users={filteredUsers} creator={creator} onSubmit={handleSubmit} />
    </Container>
  );
}
