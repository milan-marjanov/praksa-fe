import { EventDetailsDto, TimeOptionDto, RestaurantOptionDto } from '../types/Event';
import { UpdateEventDTO, TimeOption, RestaurantOption } from '../types/Event';
import { ParticipantProfileDto } from '../types/User';

export function mapDetailsToUpdateDto(
  details: EventDetailsDto,
  votingDeadline: string,
): UpdateEventDTO {
  return {
    title: details.title,
    description: details.description,
    creatorId: details.creatorId,
    participantIds: details.participants.map((p: ParticipantProfileDto) => p.id),
    votingDeadline,

    timeOptionType: details.timeOptionType,
    timeOptions: details.timeOptions.map(
      (opt: TimeOptionDto): TimeOption => ({
        id: opt.id,
        maxCapacity: opt.maxCapacity ?? undefined,
        startTime: opt.startTime,
        endTime: opt.endTime,
        createdAt: opt.createdAt,
      }),
    ),

    restaurantOptionType: details.restaurantOptionType,
    restaurantOptions: details.restaurantOptions.map(
      (opt: RestaurantOptionDto): RestaurantOption => ({
        id: opt.id,
        name: opt.name,
        menuImageUrl: opt.menuImageUrl,
        restaurantUrl: opt.restaurantUrl,
      }),
    ),
  };
}
