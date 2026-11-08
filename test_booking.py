import copy
import unittest

from booking import can_book


class TestCanBook(unittest.TestCase):
    NOW = 540
    BLOCKED = False

    def setUp(self):
        self.existing = [(600, 660)]

    def check(self, start, end, expected, now=None, blocked=None, existing=None):
        result = can_book(
            start,
            end,
            self.NOW if now is None else now,
            self.BLOCKED if blocked is None else blocked,
            self.existing if existing is None else existing,
        )
        self.assertIs(result, expected)

    # ---- Required scenarios (base data: now=540, blocked=False, [(600, 660)]) ----

    def test_touching_end_of_existing_is_allowed(self):
        self.check(660, 720, True)

    def test_touching_start_of_existing_is_allowed(self):
        self.check(540 + 1, 600, True)

    def test_overlap_rejected(self):
        self.check(630, 690, False)

    def test_blocked_rejects_otherwise_valid_request(self):
        self.check(660, 720, False, blocked=True)

    def test_exactly_120_minutes_allowed(self):
        self.check(720, 840, True)

    def test_121_minutes_rejected(self):
        self.check(720, 841, False)

    def test_start_equal_now_rejected(self):
        self.check(540, 570, False)

    # ---- AC1: ordering and day bounds ----

    def test_reversed_times_rejected(self):
        self.check(700, 680, False)

    def test_equal_start_end_rejected(self):
        self.check(700, 700, False)

    def test_negative_start_rejected(self):
        self.check(-1, 30, False, now=0)

    def test_end_after_1440_rejected(self):
        self.check(1400, 1441, False)

    def test_end_exactly_1440_allowed(self):
        self.check(1380, 1440, True)

    def test_start_zero_never_after_now(self):
        self.check(0, 30, False, now=0)

    def test_smallest_valid_start(self):
        self.check(1, 2, True, now=0, existing=[])

    def test_one_minute_booking_at_day_end(self):
        self.check(1439, 1440, True, now=1438)

    def test_now_1439_has_no_valid_slot(self):
        self.check(1439, 1440, False, now=1439)

    def test_start_one_minute_after_now_allowed(self):
        self.check(541, 570, True)

    def test_start_before_now_rejected(self):
        self.check(539, 570, False)

    # ---- AC2: duration ----

    def test_duration_1_and_119_allowed(self):
        self.check(720, 721, True)
        self.check(720, 839, True)

    # ---- AC3: blocked ----

    def test_blocked_with_invalid_request_still_false(self):
        self.check(700, 680, False, blocked=True)

    def test_blocked_with_empty_existing_false(self):
        self.check(720, 780, False, blocked=True, existing=[])

    # ---- AC4: overlap variants and multiple bookings ----

    def test_identical_interval_rejected(self):
        self.check(600, 660, False)

    def test_candidate_inside_existing_rejected(self):
        self.check(610, 650, False)

    def test_candidate_contains_existing_rejected(self):
        self.check(590, 670, False)

    def test_partial_overlap_at_start_rejected(self):
        self.check(570, 630, False)

    def test_one_minute_overlap_at_either_edge_rejected(self):
        self.check(599, 601, False)
        self.check(659, 661, False)

    def test_empty_existing_allowed(self):
        self.check(720, 780, True, existing=[])

    def test_multiple_existing_no_conflict(self):
        self.check(720, 780, True, existing=[(600, 660), (800, 900), (900, 960)])

    def test_sandwiched_between_two_bookings(self):
        self.check(600, 660, True, now=500, existing=[(540, 600), (660, 720)])

    def test_conflict_only_with_last_existing(self):
        self.check(850, 900, False, existing=[(600, 660), (700, 760), (880, 940)])

    def test_unsorted_existing_conflict_detected(self):
        self.check(650, 700, False, existing=[(900, 960), (600, 660), (700, 760)])

    def test_existing_as_tuple_of_tuples(self):
        self.check(660, 720, True, existing=((600, 660),))

    # ---- AC5: return type and non-mutation ----

    def test_returns_real_bool(self):
        self.check(660, 720, True)
        self.check(630, 690, False)

    def test_existing_not_mutated_on_true(self):
        existing = [(900, 960), (600, 660), (700, 760)]
        snapshot = copy.deepcopy(existing)
        self.assertIs(can_book(780, 840, 540, False, existing), True)
        self.assertEqual(existing, snapshot)

    def test_existing_not_mutated_on_false(self):
        existing = [(900, 960), (600, 660), (700, 760)]
        snapshot = copy.deepcopy(existing)
        self.assertIs(can_book(630, 690, 540, False, existing), False)
        self.assertEqual(existing, snapshot)  # same contents and same order

    def test_existing_not_mutated_when_blocked_or_invalid(self):
        existing = [(600, 660)]
        snapshot = copy.deepcopy(existing)
        can_book(660, 720, 540, True, existing)
        can_book(700, 680, 540, False, existing)
        self.assertEqual(existing, snapshot)

    # ---- Type / invalid-input handling ----

    def test_float_string_none_times_rejected(self):
        self.check(600.0, 660, False, existing=[])
        self.check(600, 660.0, False, existing=[])
        self.check("600", 660, False, existing=[])
        self.check(None, 660, False, existing=[])
        self.check(660, 720, False, now=540.0)

    def test_bool_times_rejected(self):
        self.check(True, 5, False, now=0, existing=[])
        self.check(1, True, False, now=0, existing=[])
        self.check(600, 660, False, now=False, existing=[])

    def test_non_bool_blocked_rejected(self):
        self.check(660, 720, False, blocked=1)
        self.check(660, 720, False, blocked="yes")
        self.check(660, 720, False, blocked=0)

    # ---- Combined failures ----

    def test_combined_failures(self):
        self.check(540, 700, False)  # starts now AND 160 min
        self.check(630, 800, False)  # overlap AND 170 min
        self.check(630, 800, False, blocked=True)  # blocked + overlap + too long


class TestMalformedExisting(unittest.TestCase):
    """v2: malformed `existing` fails closed (False) and never raises."""

    def call(self, existing):
        # Otherwise-valid request: 660-720, now=540, not blocked.
        return can_book(660, 720, 540, False, existing)

    def test_non_iterable_existing_rejected(self):
        self.assertIs(self.call(None), False)
        self.assertIs(self.call(5), False)

    def test_wrong_length_entries_rejected(self):
        self.assertIs(self.call([(600,)]), False)
        self.assertIs(self.call([(600, 660, 720)]), False)
        self.assertIs(self.call([()]), False)

    def test_non_sequence_entries_rejected(self):
        self.assertIs(self.call([None]), False)
        self.assertIs(self.call([660]), False)
        self.assertIs(self.call(["ab"]), False)
        self.assertIs(self.call("abc"), False)

    def test_non_int_values_inside_entry_rejected(self):
        self.assertIs(self.call([(600, "x")]), False)
        self.assertIs(self.call([(600.5, 660.5)]), False)
        self.assertIs(self.call([(None, 660)]), False)

    def test_bool_values_inside_entry_rejected(self):
        # Before v2, (True, 5) was silently accepted as the interval (1, 5).
        self.assertIs(self.call([(True, 5)]), False)
        self.assertIs(self.call([(0, False)]), False)

    def test_malformed_entry_after_valid_nonoverlapping_entry_rejected(self):
        self.assertIs(self.call([(600, 660), (900,)]), False)

    def test_malformed_entry_does_not_mask_valid_booking_elsewhere(self):
        # Sanity check: the same request is True when existing is well formed.
        self.assertIs(self.call([(600, 660), (900, 960)]), True)

    def test_lists_as_entries_still_supported(self):
        self.assertIs(self.call([[600, 660]]), True)
        self.assertIs(self.call([[700, 760]]), False)

    def test_generator_existing_supported(self):
        self.assertIs(self.call(iter([(600, 660)])), True)

    def test_malformed_existing_not_mutated(self):
        existing = [(600, 660), (900,), None, (True, 5)]
        snapshot = copy.deepcopy(existing)
        self.assertIs(self.call(existing), False)
        self.assertEqual(existing, snapshot)


if __name__ == "__main__":
    unittest.main()
