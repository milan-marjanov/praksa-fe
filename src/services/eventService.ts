import api from '../axios/AxiosClient';
import { CreateEventDto, EventDTO, UpdateEventDTO } from '../types/Event';

export const fetchAllEvents = async () => {
  try {
    const response = await api.get<EventDTO[]>('/api/events/fetchAllEvents');
    return response.data;
  } catch {
    return undefined;
  }
};

export async function createEvent(eventData: CreateEventDto) {
  try {
    const response = await api.post<CreateEventDto>('/api/events/createEvent', eventData);
    return response.data;
  } catch {
    return undefined;
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
