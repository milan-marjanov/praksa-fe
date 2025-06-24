export function generateId(min = 1, max = 10000): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function getCurrentDatetimeLocal() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes() + 5).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export const isValidFutureDate = (dateString: string, now: Date): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && date > now;
};

export function validateDateTime(value: string): string | null {
  if (!value) return 'This field is required.';
  const date = new Date(value);
  if (isNaN(date.getTime())) return 'Invalid date/time format.';
  const now = new Date();
  now.setSeconds(0, 0);
  if (date < now) return 'Date/time cannot be in the past.';
  return null;
}

export const formatDateTime = (dateTimeStr?: string) => {
  if (!dateTimeStr) return 'N/A';
  return dateTimeStr.replace('T', ' ').substring(0, 16);
};

export function validateStartEndTimes(start: string, end: string): string | null {
  if (!start || !end) return null;
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (endDate <= startDate) return 'End Time must be after Start Time.';
  return null;
}
