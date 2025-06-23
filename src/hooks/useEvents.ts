import { useEffect, useState } from 'react';
import { EventDTO, UserEventsResponseDTO } from '../types/Event';
import { fetchUserEvents } from '../services/eventService';
import { jwtDecode } from 'jwt-decode';
import { JwtDecoded } from '../types/User';

export interface UseEventsResult {
  createdEvents: EventDTO[];
  setCreatedEvents: React.Dispatch<React.SetStateAction<EventDTO[]>>;
  participantEvents: EventDTO[];
  setParticipantEvents: React.Dispatch<React.SetStateAction<EventDTO[]>>;
  allEvents: EventDTO[];
  setAllEvents: React.Dispatch<React.SetStateAction<EventDTO[]>>;
  loading: boolean;
  userId: number | null;
}

export function useEvents(): UseEventsResult {
  const [createdEvents, setCreatedEvents] = useState<EventDTO[]>([]);
  const [participantEvents, setParticipantEvents] = useState<EventDTO[]>([]);
  const [allEvents, setAllEvents] = useState<EventDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    setAllEvents([
      ...createdEvents,
      ...participantEvents.filter(e => !createdEvents.some(c => c.id === e.id)),
    ]);
  }, [createdEvents, participantEvents]);

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
    setCreatedEvents,
    participantEvents,
    setParticipantEvents,
    allEvents,
    setAllEvents,
    loading,
    userId,
  };
}