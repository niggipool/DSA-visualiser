from ..step_builder import ArrayStepRecorder
from ..metadata import METADATA


def selection_sort(arr):
    rec = ArrayStepRecorder(arr)
    n = len(rec.array)

    if n <= 1:
        if n == 1:
            rec.mark_sorted(0)
        rec.done()
        return rec.result(METADATA["selection-sort"])

    for i in range(n - 1):
        minimum = i
        rec.set_pointers(boundary=i, min=minimum)
        rec.select(i, f"Find the smallest value in positions {i} to {n - 1}")

        for j in range(i + 1, n):
            rec.compare(
                j,
                minimum,
                message=f"Compare {rec.array[j]} with current minimum {rec.array[minimum]}",
                active=minimum,
            )
            if rec.array[j] < rec.array[minimum]:
                minimum = j
                rec.set_pointers(min=minimum)
                rec.note(
                    f"{rec.array[minimum]} is the new minimum",
                    [minimum],
                    op_type="select",
                )

        if minimum != i:
            rec.swap(i, minimum, message=f"Swap {rec.array[i]} into position {i}")
        else:
            rec.note(f"{rec.array[i]} is already the smallest", [i], op_type="insert")

        rec.mark_sorted(i)

    rec.mark_sorted(n - 1)
    rec.done()
    return rec.result(METADATA["selection-sort"])
