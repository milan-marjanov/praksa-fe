import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { getAllUsers } from '../services/userService';
import { User } from '../types/User';
import { JwtDecoded } from '../types/JwtDecoded';

export function UseSetupEventForm() {
  const [creator, setCreator] = useState<User | undefined>(undefined);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');

    const fetchData = async () => {
      try {
        let creatorId: number | undefined = undefined;
        if (token) {
          const decoded = jwtDecode<JwtDecoded>(token);
          creatorId = decoded.id;
        }

        const users = await getAllUsers();

        const foundCreator = users.find((user) => user.id === creatorId);
        const nonCreatorUsers = users.filter((user) => user.id !== creatorId);

        setCreator(foundCreator);
        setFilteredUsers(nonCreatorUsers);
      } catch (err) {
        console.error('Error in useSetupEventForm:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { creator, filteredUsers, loading };
}
