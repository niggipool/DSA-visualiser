from ..step_builder import ArrayStepRecorder
from ..metadata import METADATA


def binary_search(arr, target):
    ordered = sorted(arr)
    rec = ArrayStepRecorder(ordered)
    rec.set_state(target=target, found=None)

    if list(arr) != ordered:
        rec.note(
            "Binary search needs sorted input, so the array was sorted first",
            [],
            "divide",
        )
    else:
        rec.note(f"Search a sorted array of {len(ordered)} values for {target}", [], "divide")

    low, high = 0, len(ordered) - 1

    while low <= high:
        mid = (low + high) // 2
        rec.set_pointers(low=low, mid=mid, high=high)
        rec.probe(mid, f"Middle of window {low}-{high} is {ordered[mid]}")

        if ordered[mid] == target:
            rec.found(mid)
            rec.clear_pointers()
            return rec.result(METADATA["binary-search"])

        if ordered[mid] < target:
            low = mid + 1
            rec.note(
                f"{ordered[mid]} is less than {target}, discard the left half",
                list(range(0, low)),
                "sorted",
            )
        else:
            high = mid - 1
            rec.note(
                f"{ordered[mid]} is greater than {target}, discard the right half",
                list(range(high + 1, len(ordered))),
                "sorted",
            )

    rec.clear_pointers()
    rec.not_found(f"Window is empty, so {target} is not in the array")
    return rec.result(METADATA["binary-search"])
