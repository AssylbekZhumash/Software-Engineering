"""Smart Campus Room Availability Checker.

Times are integer minutes after midnight. Intervals are half-open [start, end),
so two bookings that merely touch at an endpoint do not overlap.
"""

MINUTES_PER_DAY = 1440
MAX_DURATION = 120


def _is_int(value):
    """True only for real ints; bool (a subclass of int) is rejected."""
    return type(value) is int


def _is_valid_interval(item):
    """True only for a 2-element tuple/list of real ints, e.g. (600, 660)."""
    return (
        isinstance(item, (tuple, list))
        and len(item) == 2
        and _is_int(item[0])
        and _is_int(item[1])
    )


def can_book(start, end, now, blocked, existing):
    """Return True only if the room can be booked for [start, end).

    Parameters
    ----------
    start, end : int   candidate interval, minutes after midnight
    now        : int   current time, minutes after midnight (assumed 0..1439)
    blocked    : bool  True if the room is blocked for the whole day
    existing   : iterable of (s, e) pairs of already-booked intervals

    Invalid input (bad types, a non-iterable `existing`, or any entry of
    `existing` that is not a 2-element tuple/list of ints) yields False rather
    than an exception. `existing` is only read, never modified.
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
    # Fail closed (False) if `existing` is not iterable or holds a malformed
    # entry, since the room's true availability cannot then be established.
    try:
        intervals = iter(existing)
    except TypeError:
        return False
    for item in intervals:
        if not _is_valid_interval(item):
            return False
        s, e = item
        if start < e and s < end:
            return False

    # AC5: everything passed.
    return True
