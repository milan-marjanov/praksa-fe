export interface VoteDto {
  id: number;
  eventId: number;
  userId: number;
  timeOptionId: number | null;
  restaurantOptionId: number | null;
}

export interface CreateVoteDto {
  eventId: number
  timeOptionId: number | null
  restaurantOptionId: number | null
}