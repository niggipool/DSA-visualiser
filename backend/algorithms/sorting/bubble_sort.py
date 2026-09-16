"""
Bubble Sort
===========

The algorithm itself is unchanged from the original implementation. The only
difference is that it now records through StepRecorder, so it emits the same
schema as Insertion Sort (ids, type, message, progressive sorted set) instead
of the old three-field step.

The early-exit on a clean pass is kept: it is why the best case is O(n).
"""

from .step_builder import StepRecorder
from ..metadata import METADATA


def bubble_sort(arr):
    rec = StepRecorder(arr)
    n = len(rec.array)

    if n <= 1:
        if n == 1:
            rec.mark_sorted(0)
        rec.done()
        return rec.result(METADATA["bubble-sort"])

    for i in range(n - 1):
        swapped_this_pass = False

        for j in range(0, n - i - 1):
            rec.compare(j, j + 1)

            if rec.array[j] > rec.array[j + 1]:
                a, b = rec.array[j], rec.array[j + 1]
                rec.swap(j, j + 1, message=f"Swap {a} and {b}")
                swapped_this_pass = True

        # The largest remaining value has bubbled to the end of this pass.
        rec.mark_sorted(
            n - i - 1,
            message=f"{rec.array[n - i - 1]} is in its final position",
        )

        if not swapped_this_pass:
            break

    rec.done()
    return rec.result(METADATA["bubble-sort"])
