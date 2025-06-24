import { CreateEventDto } from '../types/Event';
import { generateId } from './DateTimeUtils';

const tomorrowNoon = new Date();
tomorrowNoon.setDate(tomorrowNoon.getDate() + 1);
tomorrowNoon.setHours(14, 0, 0, 0);

export const defaultData: CreateEventDto = {
  id: 0,
  title: '',
  description: '',
  creatorId: 0,
  participantIds: [],
  votingDeadline: tomorrowNoon.toISOString().slice(0, 16),
  timeOptionType: 'FIXED',
  timeOptions: [],
  restaurantOptionType: 'FIXED',
  restaurantOptions: [],
};

export const maxDescriptionChars = 255;

export const initialTimeOption = {
  id: generateId(),
  startTime: '',
  endTime: '',
  maxCapacity: undefined,
  createdAt: new Date().toISOString(),
};

export function validateStartEndTimes(start: string, end: string): string | null {
  if (!start || !end) return null;
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (endDate <= startDate) return 'End Time must be after Start Time.';
  return null;
}
