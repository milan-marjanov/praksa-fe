import api from '../axios/AxiosClient';
import { jwtDecode } from 'jwt-decode';
import type { JwtDecoded } from '../types/User';

export async function login(email: string, password: string) {
  try {
    const { data } = await api.post<{ token: string }>('/auth/signin', {
      email,
      password,
    });
    localStorage.setItem('jwtToken', data.token);
    return data.token;
  } catch {
    return undefined;
  }
}

export function getCurrentUserId(): number {
  const token = localStorage.getItem('jwtToken');
  if (!token) {
    throw new Error('No JWT token found');
  }
  const decoded = jwtDecode<JwtDecoded>(token);
  const { id } = decoded;
  if (typeof id !== 'number') {
    throw new Error('Token does not contain a valid user ID');
  }
  return id;
}
