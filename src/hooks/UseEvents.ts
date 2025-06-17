import { useEffect, useState } from 'react';
import { EventDTO } from '../types/Event';
import { fetchAllEvents } from '../services/eventService';
import { jwtDecode } from 'jwt-decode';
import { JwtDecoded } from '../types/User';

export function UseEvents() {
  const [events, setEvents] = useState<EventDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        let creatorId: number | undefined;

        if (token) {
          const decoded = jwtDecode<JwtDecoded>(token);
          creatorId = decoded.id;
        }

        const data = await fetchAllEvents();
        if (data && creatorId !== undefined) {
          const userEvents = data.filter((event) => event.creator.id === creatorId);
          setEvents(userEvents);
        } else {
          setEvents([]);
        }
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
