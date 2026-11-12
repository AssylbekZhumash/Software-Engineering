import { canBook, MAX_DURATION } from '@/booking.js';
import type { Equipment, Room } from '@/data/rooms';

// Prototype "now" is fixed at 08:00 so the demo is repeatable.
export const CURRENT_TIME = 8 * 60;
export const MAX_ATTENDEES = 500;

export interface SearchQuery {
  attendees: number;
  equipment: Equipment[];
  startHour: number;
  endHour: number;
}

export interface SearchFormInput {
  attendees: string;
  startHour: string;
  endHour: string;
  equipment: Equipment[];
}

export type SearchErrors = Partial<Record<'attendees' | 'startHour' | 'endHour', string>>;

export type RoomStatus = 'available' | 'unavailable' | 'blocked';

export interface RoomResult {
  room: Room;
  status: RoomStatus;
  reason: string | null;
}

const STATUS_ORDER: Record<RoomStatus, number> = {
  available: 0,
  unavailable: 1,
  blocked: 2,
};

export function formatHour(minutes: number): string {
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:00`;
}

function parseHour(raw: string, min: number, max: number): number | null {
  const trimmed = raw.trim();
  if (!/^\d{2}$/.test(trimmed)) return null;
  const hour = Number(trimmed);
  return hour >= min && hour <= max ? hour : null;
}

export function validateSearch(input: SearchFormInput): { query: SearchQuery | null; errors: SearchErrors } {
  const errors: SearchErrors = {};

  const attendeesText = input.attendees.trim();
  const attendees = /^\d+$/.test(attendeesText) ? Number(attendeesText) : NaN;
  if (!(attendees >= 1 && attendees <= MAX_ATTENDEES)) {
    errors.attendees = `Enter a whole number of attendees from 1 to ${MAX_ATTENDEES}.`;
  }

  const startHour = parseHour(input.startHour, 0, 23);
  if (startHour === null) {
    errors.startHour = 'Use two digits from 00 to 23, such as 09.';
  }

  const endHour = parseHour(input.endHour, 1, 24);
  if (endHour === null) {
    errors.endHour = 'Use two digits from 01 to 24, such as 11.';
  } else if (startHour !== null && endHour <= startHour) {
    errors.endHour = 'End hour must be later than the start hour.';
  }

  if (Object.keys(errors).length > 0 || startHour === null || endHour === null) {
    return { query: null, errors };
  }

  return {
    query: { attendees, equipment: input.equipment, startHour, endHour },
    errors,
  };
}

function explainUnavailable(start: number, end: number, room: Room): string {
  if (start <= CURRENT_TIME) {
    return `The start time must be after the current time (${formatHour(CURRENT_TIME)}).`;
  }
  if (end - start > MAX_DURATION) {
    return `Bookings can be at most ${MAX_DURATION / 60} hours long.`;
  }
  const clash = room.bookings.find((b) => start < b.end && end > b.start);
  if (clash) {
    return `Clashes with an existing booking from ${formatHour(clash.start)} to ${formatHour(clash.end)}.`;
  }
  return 'This time slot cannot be booked.';
}

function evaluateRoom(room: Room, query: SearchQuery): RoomResult {
  if (room.blocked) {
    return { room, status: 'blocked', reason: room.blockedReason ?? 'This room is currently blocked.' };
  }

  const start = query.startHour * 60;
  const end = query.endHour * 60;
  const free = canBook({
    start,
    end,
    now: CURRENT_TIME,
    blocked: false,
    bookings: room.bookings,
  });

  if (free) return { room, status: 'available', reason: null };
  return { room, status: 'unavailable', reason: explainUnavailable(start, end, room) };
}

export function findRoomResults(rooms: Room[], query: SearchQuery): RoomResult[] {
  return rooms
    .filter(
      (room) =>
        room.capacity >= query.attendees &&
        query.equipment.every((item) => room.equipment.includes(item))
    )
    .map((room) => evaluateRoom(room, query))
    .sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);
}
