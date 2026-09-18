from ..step_builder import ArrayStepRecorder
from ..metadata import METADATA


def quick_sort(arr):
    rec = ArrayStepRecorder(arr)
    n = len(rec.array)

    if n <= 1:
        if n == 1:
            rec.mark_sorted(0)
        rec.done()
        return rec.result(METADATA["quick-sort"])

    def partition(lo, hi):
        pivot = rec.array[hi]
        rec.set_pointers(lo=lo, hi=hi, pivot=hi)
        rec.select(hi, f"Choose {pivot} as the pivot")

        i = lo
        for j in range(lo, hi):
            rec.set_pointers(i=i, j=j)
            rec.compare(j, hi, message=f"Compare {rec.array[j]} with pivot {pivot}", active=hi)
            if rec.array[j] < pivot:
                if i != j:
                    rec.swap(i, j, message=f"Move {rec.array[j]} into the smaller side")
                else:
                    rec.note(f"{rec.array[i]} is already on the smaller side", [i], "insert")
                i += 1
                rec.set_pointers(i=i)

        if i != hi:
            rec.swap(i, hi, message=f"Put pivot {pivot} into position {i}")
        rec.mark_sorted(i, message=f"Pivot {pivot} is in its final position")
        return i

    def sort(lo, hi):
        if lo > hi:
            return
        if lo == hi:
            rec.mark_sorted(lo)
            return
        p = partition(lo, hi)
        sort(lo, p - 1)
        sort(p + 1, hi)

    sort(0, n - 1)
    rec.done()
    return rec.result(METADATA["quick-sort"])
