import { Container, Typography } from '@mui/material';
import EventForm from '../../components/events/EventForm';
import { ParticipantDto, UpdateEventDTO, EventDTO, CreateEventDto } from '../../types/Event';
import { containerStyle } from '../../styles/CommonStyles';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateEvent } from '../../services/eventService';
import { useEffect, useState } from 'react';
import { getAllUsers } from '../../services/userService';

export default function UpdateEventPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [eventData, setEventData] = useState<EventDTO | null>(null);
  const [availableUsers, setAvailableUsers] = useState<ParticipantDto[]>([]);

  useEffect(() => {
    if (location.state?.event) {
      setEventData(location.state.event);
    } else {
      navigate('/events', { replace: true });
    }
  }, [location.state, navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await getAllUsers();
        if (eventData) {
          const filteredUsers = allUsers.filter((u) => u.id !== eventData.creator.id);
          setAvailableUsers(filteredUsers);
        }
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };

    if (eventData) {
      fetchUsers();
    }
  }, [eventData]);

  if (!eventData) {
    return (
      <Container sx={{ ...containerStyle, marginTop: 5 }}>
        <Typography>Loading event data...</Typography>
      </Container>
    );
  }

  const creator = eventData.creator;
  const participantIds = eventData.participants.filter((p) => p.id !== creator.id).map((p) => p.id);

  const updateEventDto: UpdateEventDTO = {
    title: eventData.title,
    description: eventData.description,
    participantIds,
    timeOptions:
      eventData.timeOptions?.map((t) => ({
        id: t.id,
        maxCapacity: t.maxCapacity ?? 0,
        startTime: t.startTime,
        endTime: t.endTime,
        deadline: t.deadline,
        createdAt: t.createdAt,
      })) ?? [],
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
      navigate('/events');
    } catch (error) {
      console.error('Failed to update event:', error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ ...containerStyle, marginTop: 5 }}>
      <Typography variant="h5" gutterBottom>
        Edit Event
      </Typography>
      <EventForm
        users={availableUsers}
        creator={creator}
        event={updateEventDto}
        onSubmit={handleUpdateEvent}
      />
    </Container>
  );
}
