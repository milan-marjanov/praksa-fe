import { ParticipantProfileDto } from "./User";
import { VoteDto } from "./Vote";

export interface ParticipantDto {
  id: number;
  firstName: string;
  lastName: string;
  profilePicture?: string | null;
}

export interface TimeOption {
  id: number;
  maxCapacity: number;
  startTime: string;
  endTime: string;
  createdAt: string;
}

export interface RestaurantOption {
  id: number;
  name: string;
  menuImageUrl?: string;
  restaurantUrl?: string;
}

export type TimeOptionType = 'FIXED' | 'VOTING' | 'CAPACITY_BASED';

export type RestaurantOptionType = 'FIXED' | 'VOTING' | 'NONE';

export type EventModalRef = {
  validate: () => { hasError: boolean };
};

export interface EventDTO {
  id: number;
  title: string;
  description: string;
  creator: ParticipantDto;
  participants: ParticipantDto[];
  votingDeadline: string;
  timeOptionType: TimeOptionType;
  timeOptions: TimeOption[];
  restaurantOptionType: RestaurantOptionType;
  restaurantOptions: RestaurantOption[];
}

export interface CreateEventDto {
  id: number;
  title: string;
  description: string;
  creatorId: number;
  votingDeadline: string;
  participantIds: number[];
  timeOptionType: TimeOptionType;
  timeOptions: TimeOption[];
  restaurantOptionType: RestaurantOptionType;
  restaurantOptions: RestaurantOption[];
}

export interface EventModalProps {
  users: ParticipantDto[];
  creator: ParticipantDto;
  event?: UpdateEventDTO;
  onSubmit: (event: UpdateEventDTO | CreateEventDto, isUpdate: boolean) => Promise<void>;
}

export interface CreateEventModalProps {
  users: ParticipantDto[];
  creator: ParticipantDto;
  event?: EventDTO;
  open: boolean;
  onClose: () => void;
  onEventCreated?: (event: EventDTO) => void;
  onEventUpdated?: (event: EventDTO) => void;
}

export interface UpdateEventDTO {
  title: string;
  description: string;
  creatorId: number;
  participantIds: number[];
  votingDeadline: string;
  timeOptionType: TimeOptionType;
  timeOptions: TimeOption[];
  restaurantOptionType: RestaurantOptionType;
  restaurantOptions: RestaurantOption[];
}

export interface UserEventsResponseDTO {
  createdEvents: EventDTO[];
  participantEvents: EventDTO[];
}

export interface TimeOptionDto {
  id: number;
  maxCapacity: number | null;
  startTime: string;
  endTime: string;
  createdAt: string;
  votesCount: number;
  reservedCount: number;
  votedUsers: ParticipantProfileDto[];
}

export interface RestaurantOptionDto {
  id: number;
  name: string;
  menuImageUrl: string | null;
  restaurantUrl: string;
  votesCount: number;
  votedUsers: ParticipantProfileDto[];
}

export interface EventDetailsDto {
  creator: ParticipantDto;
  id: number;
  title: string;
  description: string;
  participants: ParticipantProfileDto[];
  timeOptions: TimeOptionDto[];
  restaurantOptions: RestaurantOptionDto[];
  timeOptionType: TimeOptionType;
  restaurantOptionType: RestaurantOptionType;
  currentVote: VoteDto | null;
}
