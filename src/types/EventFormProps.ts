import { User } from '../types/User';
import { EventDTO } from '../types/EventDTO';

export interface EventFormProps {
  users: User[];
  creatorId: number | null;
  event?: EventDTO;
  onSubmit: (eventData: EventDTO, isUpdate: boolean, eventId?: number) => void;
}