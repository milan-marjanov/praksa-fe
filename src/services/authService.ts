import api from '../axios/AxiosClient';
import { jwtDecode } from 'jwt-decode';
import type { JwtDecoded } from '../types/User';

export async function login(email: string, password: string): Promise<string | undefined> {
  try {
    const { data } = await api.post<{ token: string }>('auth/signin', {
      email,
      password,
    });
    localStorage.setItem('jwtToken', data.token);
    return data.token;
  } catch {
    return undefined;
  }
}

export function decodeJwt(token: string): JwtDecoded {
  console.log(jwtDecode<JwtDecoded>(token));
  return jwtDecode<JwtDecoded>(token);
}

export function getCurrentUserId(): number {
  const token = localStorage.getItem('jwtToken');
  if (!token) {
    throw new Error('No JWT token found');
  }
  const { id } = decodeJwt(token);
  if (typeof id !== 'number') {
    throw new Error('Token does not contain a valid user ID');
  }
  return id;
}
