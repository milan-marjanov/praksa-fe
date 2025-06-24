import api from '../axios/axiosClient';
import { CreateEventDto, UserEventsResponseDTO, UpdateEventDTO, EventDetailsDto, EventDTO } from '../types/Event';

export const fetchUserEvents = async (userId: number): Promise<UserEventsResponseDTO> => {
  const response = await api.get<UserEventsResponseDTO>(`/api/events/fetchUserEvents/${userId}`);
  return response.data;
};

export async function createEvent(eventData: CreateEventDto) {
  const response = await api.post<EventDTO>('/api/events/createEvent', eventData);
  return response.data;
}

export async function updateEvent(eventId: number, eventData: UpdateEventDTO) {
  const response = await api.patch<EventDTO>(`/api/events/updateEvent/${eventId}`, eventData);
  return response.data;
}

export const deleteEvent = async (eventId: number) => {
  await api.delete(`/api/events/deleteEvent/${eventId}`);
};

export const getEventDetails = async (eventId: number) => {
  const response = await api.get<EventDetailsDto>(`/api/events/${eventId}`);
  return response.data;
};
