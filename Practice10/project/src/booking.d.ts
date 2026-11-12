export const MAX_DURATION: number;
export const DAY_END: number;
export function canBook(input: {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: { start: number; end: number }[];
}): boolean;
