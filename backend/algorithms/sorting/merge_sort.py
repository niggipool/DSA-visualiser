from ..step_builder import ArrayStepRecorder
from ..metadata import METADATA


def merge_sort(arr):
    rec = ArrayStepRecorder(arr)
    n = len(rec.array)

    if n <= 1:
        if n == 1:
            rec.mark_sorted(0)
        rec.done()
        return rec.result(METADATA["merge-sort"])

    def merge(lo, mid, hi):
        left = [(rec.array[i], rec.ids[i]) for i in range(lo, mid + 1)]
        right = [(rec.array[i], rec.ids[i]) for i in range(mid + 1, hi + 1)]

        rec.set_pointers(lo=lo, mid=mid, hi=hi)
        rec.open_aux(
            left,
            right,
            lo,
            hi,
            f"Move positions {lo}-{mid} and {mid + 1}-{hi} into the merge buffer",
        )

        slot = lo
        while rec.aux_left and rec.aux_right:
            head_left = rec.aux_left[0][0]
            head_right = rec.aux_right[0][0]
            rec.compare_heads(f"Compare heads {head_left} and {head_right}")
            # `<=` takes from the left on a tie, which preserves the original
            # relative order of equal values. This is what makes the sort stable.
            if head_left <= head_right:
                rec.take("left", slot, f"{head_left} is smaller, write it into position {slot}")
            else:
                rec.take("right", slot, f"{head_right} is smaller, write it into position {slot}")
            slot += 1

        while rec.aux_left:
            value = rec.aux_left[0][0]
            rec.take("left", slot, f"Right half is empty, drain {value} from the left")
            slot += 1

        while rec.aux_right:
            value = rec.aux_right[0][0]
            rec.take("right", slot, f"Left half is empty, drain {value} from the right")
            slot += 1

        rec.close_aux()
        rec.note(
            f"Positions {lo} to {hi} are now merged and sorted",
            list(range(lo, hi + 1)),
            "insert",
        )

    def sort(lo, hi):
        if lo >= hi:
            return
        mid = (lo + hi) // 2
        rec.set_pointers(lo=lo, mid=mid, hi=hi)
        rec.note(f"Split positions {lo}-{hi} at {mid}", list(range(lo, hi + 1)), "divide")
        sort(lo, mid)
        sort(mid + 1, hi)
        merge(lo, mid, hi)

    sort(0, n - 1)
    rec.done()
    return rec.result(METADATA["merge-sort"])
