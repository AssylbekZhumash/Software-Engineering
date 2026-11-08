
import copy
import unittest

from rooms import ROOMS
from filtering import filter_rooms
from availability import (
    get_room_by_id,
    check_room_availability,
    find_available_rooms
)


class TestAssignment4(unittest.TestCase):

    # Room catalog
    def test_four_rooms_exist(self):
        self.assertGreaterEqual(len(ROOMS), 4)

    def test_unique_room_ids(self):
        ids = [room["id"] for room in ROOMS]
        self.assertEqual(len(ids), len(set(ids)))

    def test_required_room_fields(self):
        required = {
            "id", "name", "capacity",
            "equipment", "blocked", "bookings"
        }
        for room in ROOMS:
            self.assertTrue(required.issubset(room))

    # F1: Capacity
    def test_exact_capacity(self):
        results = filter_rooms(ROOMS, 8, ["whiteboard"])
        ids = [room["id"] for room in results]
        self.assertIn("R101", ids)

    def test_insufficient_capacity(self):
        results = filter_rooms(ROOMS, 9, [])
        ids = [room["id"] for room in results]
        self.assertNotIn("R101", ids)

    # F2: Equipment
    def test_all_equipment_required(self):
        results = filter_rooms(
            ROOMS, 10, ["projector", "whiteboard"]
        )
        ids = [room["id"] for room in results]
        self.assertEqual(ids, ["R102", "R104"])

    def test_missing_equipment(self):
        results = filter_rooms(
            ROOMS, 10, ["computers", "whiteboard"]
        )
        self.assertEqual(results, [])

    # F3: Blocked room
    def test_blocked_room_unavailable(self):
        result = check_room_availability(
            "R103", 660, 720, 540
        )
        self.assertFalse(result)

    # F4: Empty results
    def test_no_matching_rooms(self):
        results = filter_rooms(ROOMS, 50, [])
        self.assertEqual(results, [])

    # F5: Switching rooms
    def test_room_switching(self):
        first = check_room_availability(
            "R102", 660, 720, 540
        )
        second = check_room_availability(
            "R104", 660, 720, 540
        )
        self.assertFalse(first)
        self.assertTrue(second)

    def test_correct_room_bookings(self):
        self.assertFalse(
            check_room_availability("R101", 600, 660, 540)
        )
        self.assertTrue(
            check_room_availability("R102", 600, 660, 540)
        )

    def test_unknown_room(self):
        self.assertIsNone(get_room_by_id("R999"))
        self.assertFalse(
            check_room_availability("R999", 660, 720, 540)
        )

    # Original booking boundaries
    def test_exactly_120_minutes(self):
        self.assertTrue(
            check_room_availability("R104", 1320, 1440, 540)
        )

    def test_121_minutes_rejected(self):
        self.assertFalse(
            check_room_availability("R104", 1200, 1321, 540)
        )

    def test_touching_booking_allowed(self):
        self.assertTrue(
            check_room_availability("R101", 660, 720, 540)
        )

    def test_overlap_rejected(self):
        self.assertFalse(
            check_room_availability("R101", 630, 690, 540)
        )

    def test_booking_data_not_modified(self):
        original = copy.deepcopy(ROOMS)
        check_room_availability("R101", 630, 690, 540)
        self.assertEqual(ROOMS, original)

    # Integration: filtering + booking logic
    def test_find_available_rooms_integration(self):
        results = find_available_rooms(
            10,
            ["projector", "whiteboard"],
            660,
            720,
            540
        )
        ids = [room["id"] for room in results]
        self.assertEqual(ids, ["R104"])


if __name__ == "__main__":
    unittest.main()
