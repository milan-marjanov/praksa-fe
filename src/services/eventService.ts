import api from '../axios/AxiosClient';
import { EventDTO } from '../types/Event';

export async function createEvent(eventData: EventDTO) {
  try {
    const response = await api.post<EventDTO>('/api/events/createEvent', eventData);
    return response.data;
  } catch {
    return undefined;
  }
}
