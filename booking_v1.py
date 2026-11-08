"""Smart Campus Room Availability Checker.

Times are integer minutes after midnight. Intervals are half-open [start, end),
so two bookings that merely touch at an endpoint do not overlap.
"""

MINUTES_PER_DAY = 1440
MAX_DURATION = 120


def _is_int(value):
    """True only for real ints; bool (a subclass of int) is rejected."""
    return type(value) is int


def can_book(start, end, now, blocked, existing):
    """Return True only if the room can be booked for [start, end).

    Parameters
    ----------
    start, end : int   candidate interval, minutes after midnight
    now        : int   current time, minutes after midnight (assumed 0..1439)
    blocked    : bool  True if the room is blocked for the whole day
    existing   : iterable of (s, e) pairs of already-booked intervals

    Invalid input yields False rather than an exception. `existing` is only
    read, never modified.
    """
    # Type validation: ints only (bool and float rejected), blocked must be bool.
    if not (_is_int(start) and _is_int(end) and _is_int(now)):
        return False
    if type(blocked) is not bool:
        return False

    # AC3: a blocked room rejects every request.
    if blocked:
        return False

    # AC1: 0 <= start < end <= 1440.
    if not (0 <= start < end <= MINUTES_PER_DAY):
        return False

    # AC1: start must be strictly after now.
    if start <= now:
        return False

    # AC2: duration may be at most 120 minutes (exactly 120 allowed).
    if end - start > MAX_DURATION:
        return False

    # AC4: reject overlap with any existing interval; touching is allowed.
    for s, e in existing:
        if start < e and s < end:
            return False

    # AC5: everything passed.
    return True
