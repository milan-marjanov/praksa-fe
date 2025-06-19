import { Container, Typography } from '@mui/material';
import { UpdateEventDTO, EventDTO, CreateEventDto } from '../../types/Event';
import { containerStyle } from '../../styles/CommonStyles';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateEvent } from '../../services/eventService';
import { useEffect, useState } from 'react';
import { useSetupEventForm } from '../../hooks/useSetupEventForm';
import EventModal from '../../components/events/EventModal';

export default function UpdateEventPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState<EventDTO | null>(null);

  const { creator, filteredUsers, loading } = useSetupEventForm();

  useEffect(() => {
    if (location.state?.event) {
      setEventData(location.state.event);
    } else {
      navigate('/createdEvents', { replace: true });
    }
  }, [location.state, navigate]);

  if (!eventData || loading || !creator) {
    return (
      <Container sx={{ ...containerStyle, marginTop: 5 }}>
        <Typography>Loading event data...</Typography>
      </Container>
    );
  }

  const participantIds = eventData.participants.map((p) => p.id);

  const updateEventDto: UpdateEventDTO = {
    title: eventData.title,
    description: eventData.description,
    participantIds,
    timeOptions: eventData.timeOptions ?? [],
    restaurantOptions: eventData.restaurantOptions ?? [],
  };

  const handleUpdateEvent = async (
    updatedData: CreateEventDto | UpdateEventDTO,
    isUpdate: boolean,
  ) => {
    if (!isUpdate) {
      console.warn('Create attempted on update page, ignoring.');
      return;
    }

    try {
      await updateEvent(eventData.id, updatedData as UpdateEventDTO);
      navigate('/createdEvents');
    } catch (error) {
      console.error('Failed to update event:', error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ ...containerStyle, marginTop: 5 }}>
      <Typography variant="h5" gutterBottom>
        Edit Event
      </Typography>
      <EventModal
        users={filteredUsers}
        creator={creator}
        event={updateEventDto}
        onSubmit={handleUpdateEvent}
      />
    </Container>
  );
}
