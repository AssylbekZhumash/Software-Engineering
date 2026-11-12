import { test, expect } from 'vitest';
import { canBook } from './booking.js';

const make = (over = {}) => ({
  start: 0, end: 0, now: 540, blocked: false,
  bookings: [{ start: 600, end: 660 }], ...over,
});
const run = (over) => canBook(make(over));

test('T01 AC4: touching after is available (660-720)', () => expect(run({ start: 660, end: 720 })).toBe(true));
test('T02 AC1: starts now is rejected (540-570)', () => expect(run({ start: 540, end: 570 })).toBe(false));
test('T03 AC1: zero duration rejected (720-720)', () => expect(run({ start: 720, end: 720 })).toBe(false));
test('T04 AC1: reversed interval rejected (750-720)', () => expect(run({ start: 750, end: 720 })).toBe(false));
test('T05 AC1: past day end rejected (1380-1441)', () => expect(run({ start: 1380, end: 1441 })).toBe(false));
test('T06 AC2: exactly 120 min is available (720-840)', () => expect(run({ start: 720, end: 840 })).toBe(true));
test('T07 AC2: 121 min rejected (720-841)', () => expect(run({ start: 720, end: 841 })).toBe(false));
test('T08 AC4: touching before is available (570-600)', () => expect(run({ start: 570, end: 600 })).toBe(true));
test('T09 AC4: partial overlap rejected (630-690)', () => expect(run({ start: 630, end: 690 })).toBe(false));
test('T10 AC4: interval containing booking rejected (570-690)', () => expect(run({ start: 570, end: 690 })).toBe(false));
test('T11 AC4: interval inside booking rejected (615-645)', () => expect(run({ start: 615, end: 645 })).toBe(false));
test('T12 AC4: identical interval rejected (600-660)', () => expect(run({ start: 600, end: 660 })).toBe(false));
test('T13 AC3: blocked room rejected (660-720)', () => expect(run({ start: 660, end: 720, blocked: true })).toBe(false));
test('T14 AC4: no bookings is available (630-690)', () => expect(run({ start: 630, end: 690, bookings: [] })).toBe(true));

test('T15 AC5: booking data is not changed', () => {
  const input = make({ start: 660, end: 720 });
  const before = JSON.stringify(input.bookings);
  expect(canBook(input)).toBe(true);
  expect(JSON.stringify(input.bookings)).toBe(before);
});
test('T16 own case, AC1: one minute after now is available (541-571)', () => expect(run({ start: 541, end: 571 })).toBe(true));
test('T17 own case, AC1: ends exactly at 1440 is available (1380-1440)', () => expect(run({ start: 1380, end: 1440 })).toBe(true));

test('T18 AC5: unsorted multiple bookings are not reordered or modified', () => {
  const input = make({ start: 700, end: 760, bookings: [{ start: 900, end: 960 }, { start: 600, end: 660 }] });
  const before = JSON.stringify(input.bookings);
  canBook(input);
  expect(JSON.stringify(input.bookings)).toBe(before);
});

test('T19 AC4: fits exactly between two bookings (660-720)', () =>
  expect(run({ start: 660, end: 720,
    bookings: [{ start: 600, end: 660 }, { start: 720, end: 780 }] })).toBe(true));
