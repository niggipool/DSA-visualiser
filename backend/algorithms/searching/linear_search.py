from ..step_builder import ArrayStepRecorder
from ..metadata import METADATA


def linear_search(arr, target):
    rec = ArrayStepRecorder(arr)
    rec.set_state(target=target, found=None)
    rec.note(f"Search for {target} by checking every position in order", [], "divide")

    for index, value in enumerate(rec.array):
        rec.set_pointers(cursor=index)
        rec.probe(index, f"Is {value} equal to {target}?")
        if value == target:
            rec.found(index)
            rec.clear_pointers()
            return rec.result(METADATA["linear-search"])
        rec.note(f"{value} is not {target}, move right", [index], "sorted")

    rec.clear_pointers()
    rec.not_found(f"{target} is not in the array")
    return rec.result(METADATA["linear-search"])
