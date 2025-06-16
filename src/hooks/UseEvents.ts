import { useEffect, useState } from 'react';
import { EventDTO } from '../types/Event';
import { fetchAllEvents } from '../services/eventService';

export function UseEvents() {
  const [events, setEvents] = useState<EventDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchAllEvents();
        setEvents(data ?? []);
      } catch (error) {
        console.error('Failed to load events:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  return { events, setEvents, loading };
}
