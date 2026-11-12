# Smart Campus Room Availability Checker

A read-only React + TypeScript prototype to check availability of **one fictional campus room**. It uses a fixed demonstration clock of **08:00** and predefined example bookings. No login, backend, database, external API, or booking creation is required.

## Setup

Requires Node.js and npm. From the project root:

```bash
npm ci
npm run dev
```

Open the local URL printed by Vite. All data is local and fictional.

## Verification commands

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

These scripts are defined in `package.json`. Passing tests do not replace manual desktop/mobile checks.

## Structure

- `src/App.tsx` — page layout and result wiring
- `src/components/` — search controls and feedback messages
- `src/lib/availability.ts` — input validation, filters, availability/status mapping
- `src/booking.js` — pure booking decision (`canBook`)
- `src/data/rooms.ts` — single fictional room and booking fixture
- `src/booking.test.js` — original core booking rule tests
- `src/lib/availability.test.ts` — UI/search logic regression tests
- `AGENTS.md` — boundaries, safe checks, forbidden actions, human review gates

## Acceptance criteria

- **AC1:** Reject invalid, reversed, zero-length, or past time windows.
- **AC2:** Reject duration over 120 minutes; exactly 120 is permitted.
- **AC3:** Reject a blocked room.
- **AC4:** Reject overlapping bookings; intervals touching only at endpoints are permitted.
- **AC5:** Read-only checks must not mutate fictional booking fixtures.
- **AC6:** Show clear availability messages with usable desktop/mobile layout (manual visual verification required).

## Constraints and limitations

The demo supports whole-hour selection for a single day and uses a fixed current time of 08:00; it is not a live calendar. Displayed room availability is hypothetical, not an actual reservation system. Do not enter real personal data or secrets.
