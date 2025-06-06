import api from './apiClient';

export async function fetchHello(): Promise<string> {
  const response = await api.get<string>('/hello1234');
  return response.data;
}
