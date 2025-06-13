import { User } from '../types/User';

export interface EventDTO {
  id: number;
  title: string;
  description: string;
  participantIds: number[];
  creatorId: number;
}

export interface EventFormProps {
  users: User[];
  creatorId: number | null;
  event?: EventDTO;
  onSubmit: (eventData: EventDTO, isUpdate: boolean, eventId?: number) => void;
}
