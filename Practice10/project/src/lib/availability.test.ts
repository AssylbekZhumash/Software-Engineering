import { describe, expect, test } from 'vitest';
import { ROOMS, type Room } from '@/data/rooms';
import { CURRENT_TIME, findRoomResults, validateSearch } from './availability';

const input = (overrides: Partial<Parameters<typeof validateSearch>[0]> = {}) => ({
  attendees: '2', startHour: '11', endHour: '12', equipment: [] as Room['equipment'], ...overrides,
});

const query = (overrides: Partial<NonNullable<ReturnType<typeof validateSearch>['query']>> = {}) => ({
  attendees: 2, startHour: 11, endHour: 12, equipment: [] as Room['equipment'], ...overrides,
});

describe('Practice #10 search / availability regression checks', () => {
  test('single room scope matches Practice #09', () => {
    expect(ROOMS).toHaveLength(1);
  });

  test('valid input becomes a search query', () => {
    expect(validateSearch(input()).query).toEqual(query());
  });

  test('invalid attendees, reversed hours and malformed hours report errors', () => {
    expect(validateSearch(input({ attendees: '0' })).errors.attendees).toBeDefined();
    expect(validateSearch(input({ startHour: '13', endHour: '12' })).errors.endHour).toBeDefined();
    expect(validateSearch(input({ startHour: '9' })).errors.startHour).toBeDefined();
  });

  test('free time is available and endpoint touching is accepted', () => {
    expect(findRoomResults(ROOMS, query())[0].status).toBe('available');
    expect(findRoomResults(ROOMS, query({ startHour: 9, endHour: 10 }))[0].status).toBe('available');
  });

  test('overlap is rejected with a specific reason', () => {
    const [result] = findRoomResults(ROOMS, query({ startHour: 10, endHour: 11 }));
    expect(result.status).toBe('unavailable');
    expect(result.reason).toMatch(/Clashes with an existing booking/);
  });

  test('past start and too-long duration are unavailable', () => {
    expect(findRoomResults(ROOMS, query({ startHour: CURRENT_TIME / 60, endHour: 9 }))[0].reason).toMatch(/after the current time/);
    expect(findRoomResults(ROOMS, query({ startHour: 11, endHour: 14 }))[0].reason).toMatch(/at most 2 hours/);
  });

  test('room filters exclude insufficient capacity or missing equipment', () => {
    expect(findRoomResults(ROOMS, query({ attendees: 13 }))).toHaveLength(0);
    expect(findRoomResults(ROOMS, query({ equipment: ['projector'] }))).toHaveLength(0);
  });

  test('blocked rooms produce the blocked status', () => {
    const blocked: Room = { ...ROOMS[0], blocked: true, blockedReason: 'Maintenance' };
    expect(findRoomResults([blocked], query())[0]).toMatchObject({ status: 'blocked', reason: 'Maintenance' });
  });

  test('availability checks leave fixture data unchanged', () => {
    const before = JSON.stringify(ROOMS);
    findRoomResults(ROOMS, query());
    expect(JSON.stringify(ROOMS)).toBe(before);
  });
});
