import api from '../api/apiClient';
import { jwtDecode } from 'jwt-decode';
import type { JwtDecoded } from '../types/JwtDecodedDTO';

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
