class StepRecorder:
    def __init__(self, array):
        self.array = list(array)
        self.ids = list(range(len(array)))
        self.sorted_slots = set()
        self.steps = []
        self.comparisons = 0
        self.writes = 0

    # ------------------------------------------------------------------ #
    # internal
    # ------------------------------------------------------------------ #
    def _emit(self, op_type, indices, message, active=None, swapped=False):
        self.steps.append(
            {
                "array": list(self.array),
                "ids": list(self.ids),
                "type": op_type,
                "indices": list(indices),
                "active": active,
                "sorted": sorted(self.sorted_slots),
                "message": message,
                # legacy fields
                "compared": list(indices),
                "swapped": swapped,
            }
        )

    # ------------------------------------------------------------------ #
    # operations
    # ------------------------------------------------------------------ #
    def select(self, index, message=None):
        """Mark an element as the current focus (the key, the pivot, the min)."""
        value = self.array[index]
        self._emit(
            "select",
            [index],
            message or f"Select {value} as the current element",
            active=index,
        )

    def compare(self, i, j, message=None, active=None):
        """Read two slots. Never mutates the array."""
        self.comparisons += 1
        a, b = self.array[i], self.array[j]
        self._emit(
            "compare",
            [i, j],
            message or f"Compare {a} and {b}",
            active=active,
        )

    def swap(self, i, j, message=None):
        """Exchange two slots. Values and ids move together."""
        self.array[i], self.array[j] = self.array[j], self.array[i]
        self.ids[i], self.ids[j] = self.ids[j], self.ids[i]
        self.writes += 2
        self._emit(
            "swap",
            [i, j],
            message or f"Swap {self.array[j]} and {self.array[i]}",
            swapped=True,
        )

    def shift_right(self, src, key_value, key_id, message=None):
    
        moved = self.array[src]
        moved_id = self.ids[src]

        self.array[src + 1] = moved
        self.ids[src + 1] = moved_id
        self.array[src] = key_value
        self.ids[src] = key_id
        self.writes += 1

        self._emit(
            "shift",
            [src, src + 1],
            message or f"Shift {moved} one position right",
            active=src,
        )

    def insert(self, index, message=None):
        """Confirm the key has landed. The array is already correct here."""
        value = self.array[index]
        self._emit(
            "insert",
            [index],
            message or f"Insert {value} at position {index}",
            active=index,
        )

    def mark_sorted(self, *indices, message=None):
        for index in indices:
            self.sorted_slots.add(index)
        values = ", ".join(str(self.array[i]) for i in indices)
        self._emit(
            "sorted",
            list(indices),
            message or f"{values} is now in its final position",
        )

    def done(self, message="Array is fully sorted"):
        self.sorted_slots = set(range(len(self.array)))
        self._emit("done", [], message)

    # ------------------------------------------------------------------ #
    # result
    # ------------------------------------------------------------------ #
    def result(self, meta=None):
        return {
            "array": list(self.array),
            "swapped_array": list(self.array),  # legacy key, still supported
            "steps": self.steps,
            "stats": {
                "comparisons": self.comparisons,
                "writes": self.writes,
                "steps": len(self.steps),
            },
            "meta": meta or {},
        }
