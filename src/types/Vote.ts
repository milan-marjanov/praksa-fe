export interface VoteDto {
  id: number;
  eventId: number;
  userId: number;
  timeOptionId: number | null;
  restaurantOptionId: number | null;
}
