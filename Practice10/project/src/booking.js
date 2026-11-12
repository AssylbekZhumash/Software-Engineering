// Smart Campus room availability. Times are minutes after midnight (same day).
export const MAX_DURATION = 120;
export const DAY_END = 1440;

export function canBook({ start, end, now, blocked, bookings }) {
  // AC1: valid interval, strictly after "now"
  if (!Number.isFinite(start) || !Number.isFinite(end) || !Number.isFinite(now)) return false;
  if (start < 0 || start >= end || end > DAY_END) return false;
  if (start <= now) return false;
  // AC2: max 120 minutes (exactly 120 is allowed)
  if (end - start > MAX_DURATION) return false;
  // AC3: blocked room
  if (blocked) return false;
  // AC4: overlap rejected, touching endpoints allowed
  for (const b of bookings) {
    if (start < b.end && end > b.start) return false;
  }
  return true;
}
