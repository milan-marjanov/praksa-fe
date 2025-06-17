import api from '../axios/AxiosClient';
import { CreateEventDto, EventDTO, UpdateEventDTO } from '../types/Event';

export const fetchAllEvents = async () => {
  const response = await api.get<EventDTO[]>('/api/events/fetchAllEvents', {
    validateStatus: (status) => (status >= 200 && status < 300) || status === 404,
  });

  if (response.status === 404) {
    return [];
  }

  return response.data;
};

export async function createEvent(eventData: CreateEventDto) {
  try {
    const response = await api.post<CreateEventDto>('/api/events/createEvent', eventData);
    return response.data;
  } catch (err: any) {
    if (err.response?.status === 404) {
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
