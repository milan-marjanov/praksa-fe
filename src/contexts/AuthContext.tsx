import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getMyProfile } from '../services/userService';
import type { MyProfileDTO } from '../types/User';

interface AuthContextType {
  user: MyProfileDTO | null;
  loading: boolean;
  userId: number | null;
  setUserId: Function;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  userId: null,
  setUserId: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<MyProfileDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) return;
    (async () => {
      try {
        const profile = (await getMyProfile()) as MyProfileDTO;
        setUser(profile);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  return (
    <AuthContext.Provider value={{ user, loading, userId, setUserId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
