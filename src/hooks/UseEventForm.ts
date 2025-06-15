// hooks/useSetupEventForm.ts
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { getAllUsers } from '../services/userService';
import { User } from '../types/User';
import { EventDTO } from '../types/Event';
import { JwtDecoded } from '../types/JwtDecoded';

export function useSetupEventForm(mockEvent?: EventDTO) {
  const [creatorId, setCreatorId] = useState<number | undefined>(undefined);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventData, setEventData] = useState<EventDTO | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const decoded = jwtDecode<JwtDecoded>(token);
        setCreatorId(decoded.id);
      } catch (err) {
        console.error('Failed to decode JWT token', err);
      }
    }

    getAllUsers()
      .then((data) => setUsers(data))
      .catch((err) => console.error('Failed to fetch users', err))
      .finally(() => setLoading(false));

    if (mockEvent) {
      setEventData(mockEvent);
    }
  }, [mockEvent]);

  return { creatorId, users, loading, eventData };
}
