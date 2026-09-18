from ..step_builder import StepRecorder
from ..metadata import METADATA


def insertion_sort(arr):
    rec = StepRecorder(arr)
    n = len(rec.array)

    if n <= 1:
        if n == 1:
            rec.mark_sorted(0)
        rec.done()
        return rec.result(METADATA["insertion-sort"])

    # The first element is trivially a sorted subarray of length 1.
    rec.mark_sorted(0, message=f"{rec.array[0]} starts as the sorted portion")

    for i in range(1, n):
        key = rec.array[i]
        key_id = rec.ids[i]
        rec.select(i, f"Take {key} as the key to insert")

        hole = i  # where the key currently sits
        j = i - 1

        while j >= 0:
            rec.compare(
                j,
                hole,
                message=f"Compare {rec.array[j]} and {key}",
                active=hole,
            )

            if rec.array[j] <= key:
                break

            # arr[j] is bigger, so it moves right and the key moves into its slot
            rec.shift_right(j, key, key_id)
            hole = j
            j -= 1

        rec.insert(hole, f"Insert {key} at position {hole}")
        rec.mark_sorted(
            *range(0, i + 1),
            message=f"Positions 0 to {i} are sorted",
        )

    rec.done()
    return rec.result(METADATA["insertion-sort"])
