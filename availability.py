
from rooms import ROOMS
from booking import can_book
from filtering import filter_rooms


def get_room_by_id(room_id, rooms=None):
    """Find a room by ID."""

    if rooms is None:
        rooms = ROOMS

    for room in rooms:
        if room["id"] == room_id:
            return room

    return None


def check_room_availability(room_id, start, end, now, rooms=None):
    """Check the selected room's availability."""

    room = get_room_by_id(room_id, rooms)

    if room is None:
        return False

    return can_book(
        start,
        end,
        now,
        room["blocked"],
        room["bookings"]
    )


def find_available_rooms(attendees, equipment, start, end, now, rooms=None):
    """Find rooms matching filters and available at the requested time."""

    if rooms is None:
        rooms = ROOMS

    matching_rooms = filter_rooms(rooms, attendees, equipment)

    available_rooms = []

    for room in matching_rooms:
        if can_book(start, end, now, room["blocked"], room["bookings"]):
            available_rooms.append(room)

    return available_rooms
