import api from '../api/apiClient';
import axios from 'axios';
import type { JwtDecoded } from '../types/JwtDecoded';

export async function login(email: string, password: string): Promise<string> {
  try {
    const response = await api.post<{ token: string }>(
      '/auth/login',
      null,
      { params: { email, password } }
    );
    localStorage.setItem('jwtToken', response.data.token);
    return response.data.token;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 400) {
        throw new Error('Bad request: Please check your input.');
      } else if (status === 401) {
        throw new Error('Unauthorized: Invalid email or password.');
      } else if (status === 500) {
        throw new Error('Server error: Please try again later.');
      }
      throw new Error(error.response?.data?.message ?? 'Login failed');
    }
    throw new Error('Login failed');
  }
}

export async function decodeJwt(token: string): Promise<JwtDecoded> {
  try {
    const response = await api.post<JwtDecoded>(
      '/auth/decodeJwt',
      token
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 400) {
        throw new Error('Bad request: Invalid token format.');
      } else if (status === 401) {
        throw new Error('Unauthorized: Token is invalid or expired.');
      } else if (status === 500) {
        throw new Error('Server error: Please try again later.');
      }
      throw new Error(error.response?.data?.message ?? 'Failed to decode Jwt token');
    }
    throw new Error('Failed to decode Jwt token');
  }
}
