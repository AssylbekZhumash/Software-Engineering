export type Equipment = 'projector' | 'whiteboard' | 'computers' | 'speakers';

export interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
  equipment: Equipment[];
  blocked: boolean;
  blockedReason?: string;
  bookings: { start: number; end: number }[];
}

export const EQUIPMENT_OPTIONS: { id: Equipment; label: string }[] = [
  { id: 'projector', label: 'Projector' },
  { id: 'whiteboard', label: 'Whiteboard' },
  { id: 'computers', label: 'Computers' },
  { id: 'speakers', label: 'Speakers' },
];

// Practice #09 and #10 use one fictional room. Preserve the booking fixture.
export const ROOMS: Room[] = [
  {
    id: 'harper-204',
    name: 'Harper Study Lab',
    building: 'Library, Level 2',
    capacity: 12,
    equipment: ['computers', 'whiteboard'],
    blocked: false,
    bookings: [{ start: 600, end: 660 }],
  },
];
