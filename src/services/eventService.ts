import api from '../axios/AxiosClient';
import axios from 'axios';
import { CreateEventDto, UserEventsResponseDTO, UpdateEventDTO } from '../types/Event';

export const fetchUserEvents = async (userId: number): Promise<UserEventsResponseDTO> => {
  const response = await api.get<UserEventsResponseDTO>(
    `/api/events/fetchUserEvents/${userId}`
  );
  return response.data;
};


export async function createEvent(eventData: CreateEventDto) {
  try {
    const response = await api.post<CreateEventDto>('/api/events/createEvent', eventData);
    console.log(response.data)
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      return [];
    }
    throw err;
  }
}

export async function updateEvent(eventId: number, eventData: UpdateEventDTO) {
  try {
    const response = await api.patch(`/api/events/updateEvent/${eventId}`, eventData);
    return response.data;
  } catch {
    return undefined;
  }
}

export const deleteEvent = async (eventId: number) => {
  try {
    await api.delete(`/api/events/deleteEvent/${eventId}`);
  } catch {
    return undefined;
  }
};
