import { User } from '../types/User';

export interface EventDTO {
  id: number;
  name: string;
  description: string;
  participants: number[];
  creatorId: number;
}

export interface EventFormProps {
  users: User[];
  creatorId: number | null;
  event?: EventDTO;
  onSubmit: (eventData: EventDTO, isUpdate: boolean, eventId?: number) => void;
}
