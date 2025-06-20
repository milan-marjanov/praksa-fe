import api from '../axios/axiosClient';
import { CreateEventDto, UserEventsResponseDTO, UpdateEventDTO, EventDetailsDto } from '../types/Event';



export const fetchUserEvents = async (userId: number): Promise<UserEventsResponseDTO | null> => {
  const response = await api.get<UserEventsResponseDTO>(`/api/events/fetchUserEvents/${userId}`);
  return response.data ?? null;
};

export const createEvent = async (eventData: CreateEventDto): Promise<CreateEventDto | null> => {
  const response = await api.post<CreateEventDto>('/api/events/createEvent', eventData);
  return response.data ?? null;
};

export const updateEvent = async (eventId: number, eventData: UpdateEventDTO): Promise<UpdateEventDTO | null> => {
  const response = await api.patch(`/api/events/updateEvent/${eventId}`, eventData);
  return response.data ?? null;
};

export const deleteEvent = async (eventId: number): Promise<boolean> => {
  const response = await api.delete(`/api/events/deleteEvent/${eventId}`);
  return response.status === 200;
};

export const getEventDetails = async (eventId: number): Promise<EventDetailsDto | null> => {
  const response = await api.get<EventDetailsDto>(`/api/events/${eventId}`, {
    validateStatus: (status) => (status >= 200 && status < 300) || status === 404,
  });

  return response.status === 404 ? null : response.data ?? null;
};

