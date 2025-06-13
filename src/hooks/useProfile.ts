import { useState, useEffect } from 'react';
import { getMyProfile, getUserProfile } from '../services/userService';
import type { MyProfileDTO, UserProfileDTO } from '../types/User';

type Result = {
  data: MyProfileDTO | UserProfileDTO | null;
  loading: boolean;
  error: Error | null;
};

export default function useProfile(userId?: number): Result {
  const [data, setData] = useState<MyProfileDTO | UserProfileDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      setLoading(true);
      try {
        const profile = userId ? await getUserProfile(userId) : await getMyProfile();
        if (!ignore) {
          setData(profile);
          setError(null);
        }
      } catch (err) {
        if (!ignore) setError(err as Error);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchData();
    return () => {
      ignore = true;
    };
  }, [userId]);

  return { data, loading, error };
}
