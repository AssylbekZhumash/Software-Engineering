
def filter_rooms(rooms, attendees, required_equipment):
    """Return rooms matching capacity and equipment requirements."""

    matching_rooms = []

    for room in rooms:

        # F1: Capacity filter
        if room["capacity"] < attendees:
            continue

        # F2: Equipment filter
        if not all(
            item in room["equipment"]
            for item in required_equipment
        ):
            continue

        matching_rooms.append(room)

    return matching_rooms
