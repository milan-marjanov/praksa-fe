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
