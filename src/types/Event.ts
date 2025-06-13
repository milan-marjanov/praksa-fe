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

export interface UpdateEventDTO {
  title: string;
  description: string;
  participantIds: number[];
  timeOptions: TimeOptionDTO[];
  restaurantOptions: RestaurantOption[];
}

export interface TimeOptionDTO {
  id?: number;
  maxCapacity: number;
  startTime: string;
  endTime: string;
  deadline: string;
  createdAt?: string;
}

export interface RestaurantOption {
  id?: number;
  name: string;
  menuImageUrl?: string;
  restaurantUrl?: string;
}
