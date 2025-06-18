export interface ParticipantDto {
  id: number;
  firstName: string;
  lastName: string;
  profilePicture?: string | null;
}

export interface TimeOption {
  id: number;
  maxCapacity?: number;
  startTime: string;
  endTime: string;
  deadline: string;
  createdAt: string;
}

export interface RestaurantOption {
  id: number;
  name: string;
  menuImageUrl?: string;
  restaurantUrl?: string;
}

export interface EventDTO {
  id: number;
  title: string;
  description: string;
  creator: ParticipantDto;
  participants: ParticipantDto[];
  timeOptions: TimeOption[];
  restaurantOptions: RestaurantOption[];
}

export interface CreateEventDto {
  id: number;
  title: string;
  description: string;
  creatorId: number;
  participantIds: number[];
}

export interface EventFormProps {
  users: ParticipantDto[];
  creator: ParticipantDto;
  event?: UpdateEventDTO;
  onSubmit: (event: UpdateEventDTO | CreateEventDto, isUpdate: boolean) => Promise<void>;
}

export interface UpdateEventDTO {
  title: string;
  description: string;
  participantIds: number[];
  timeOptions: TimeOption[];
  restaurantOptions: RestaurantOption[];
}
/*
export interface TimeOptionDTO {
  id?: number;
  maxCapacity: number;
  startTime: string;
  endTime: string;
  deadline: string;
  createdAt?: string;
}*/

export interface UserProfileDto {
  id:number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface TimeOptionDto {
  id: number;
  maxCapacity: number | null;
  startTime: string;
  endTime: string;
  deadline: string;
  createdAt: string | null;
}

export interface RestaurantOptionDto {
  id: number;
  name: string;
  menuImageUrl: string | null;
  restaurantUrl: string;
}

export interface EventDetailsDto {
  id: number;
  title: string;
  description: string;
  participants: UserProfileDto[];
  timeOptions: TimeOptionDto[];
  restaurantOptions: RestaurantOptionDto[];
}
