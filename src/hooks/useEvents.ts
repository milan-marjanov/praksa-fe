import { useEffect, useState } from 'react';
import { EventDTO, UserEventsResponseDTO } from '../types/Event';
import { fetchUserEvents } from '../services/eventService';
import { jwtDecode  } from 'jwt-decode';
import { JwtDecoded } from '../types/User';

export function useEvents() {
  const [createdEvents, setCreatedEvents] = useState<EventDTO[]>([]);
  const [participantEvents, setParticipantEvents] = useState<EventDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<number | null>(null);

  const allEvents = [
    ...createdEvents,
    ...participantEvents.filter(e => !createdEvents.find(c => c.id === e.id)),
  ];

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) return;

        const { id } = jwtDecode<JwtDecoded>(token);
        setUserId(id);

        const data: UserEventsResponseDTO = await fetchUserEvents(id);
        setCreatedEvents(data.createdEvents);
        setParticipantEvents(data.participantEvents);
      } catch (error) {
        console.error('Failed to load events:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  return {
    createdEvents,
    participantEvents,
    allEvents,
    loading,
    setCreatedEvents,
    userId,
  };
}