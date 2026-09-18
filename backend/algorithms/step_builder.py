class ArrayStepRecorder:
    def __init__(self, array):
        self.array = list(array)
        self.ids = list(range(len(array)))
        self.next_id = len(array)
        self.sorted_slots = set()
        self.pointers = {}
        self.aux_left = None
        self.aux_right = None
        self.state = {}  # extra fields merged into every step (e.g. target)
        self.steps = []
        self.comparisons = 0
        self.writes = 0

    # ------------------------------------------------------------------ #
    # internal
    # ------------------------------------------------------------------ #
    def _emit(self, op_type, indices, message, active=None, swapped=False):
        step = {
            "array": list(self.array),
            "ids": list(self.ids),
            "type": op_type,
            "indices": list(indices),
            "active": active,
            "sorted": sorted(self.sorted_slots),
            "pointers": dict(self.pointers),
            "auxLeft": None if self.aux_left is None else [v for v, _ in self.aux_left],
            "auxLeftIds": None if self.aux_left is None else [i for _, i in self.aux_left],
            "auxRight": None if self.aux_right is None else [v for v, _ in self.aux_right],
            "auxRightIds": None if self.aux_right is None else [i for _, i in self.aux_right],
            "message": message,
            # legacy fields, kept so older frontend code keeps working
            "compared": list(indices),
            "swapped": swapped,
        }
        step.update(self.state)
        self.steps.append(step)

   
    def set_pointers(self, **named):
        for key, value in named.items():
            if value is None:
                self.pointers.pop(key, None)
            else:
                self.pointers[key] = value

    def clear_pointers(self):
        self.pointers = {}

    def set_state(self, **named):
        self.state.update(named)

    def select(self, index, message=None):
        self._emit(
            "select",
            [index],
            message or f"Select {self.array[index]} as the current element",
            active=index,
        )

    def compare(self, i, j, message=None, active=None):
        self.comparisons += 1
        self._emit(
            "compare",
            [i, j],
            message or f"Compare {self.array[i]} and {self.array[j]}",
            active=active,
        )

    def probe(self, index, message=None):
        """A search reading one slot."""
        self.comparisons += 1
        self._emit("probe", [index], message or f"Check position {index}", active=index)

    def note(self, message, indices=(), op_type="note"):
        self._emit(op_type, indices, message)


    def swap(self, i, j, message=None):
        a, b = self.array[i], self.array[j]
        self.array[i], self.array[j] = self.array[j], self.array[i]
        self.ids[i], self.ids[j] = self.ids[j], self.ids[i]
        self.writes += 2
        self._emit("swap", [i, j], message or f"Swap {a} and {b}", swapped=True)

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
        self._emit(
            "insert",
            [index],
            message or f"Insert {self.array[index]} at position {index}",
            active=index,
        )

    def write(self, index, value, element_id, message=None):
        """Overwrite a slot, used by merge sort writing back from its buffer."""
        self.array[index] = value
        self.ids[index] = element_id
        self.writes += 1
        self._emit(
            "write",
            [index],
            message or f"Write {value} into position {index}",
            active=index,
        )


    def open_aux(self, left, right, lo, hi, message=None):
        """`left` and `right` are lists of (value, id) pairs taken from lo..hi."""
        self.aux_left = list(left)
        self.aux_right = list(right)
        for slot in range(lo, hi + 1):
            self.array[slot] = None
            self.ids[slot] = -(slot + 1)  # unique, never collides with a real id
        self._emit(
            "divide",
            list(range(lo, hi + 1)),
            message or "Move both halves out into the merge buffer",
        )

    def compare_heads(self, message=None):
        """Merge always compares the head of each half."""
        self.comparisons += 1
        self._emit("compare", [], message or "Compare the head of each half")

    def take(self, side, index, message=None):
        """Pop the head of one half back into the main array at `index`."""
        source = self.aux_left if side == "left" else self.aux_right
        value, element_id = source.pop(0)
        self.array[index] = value
        self.ids[index] = element_id
        self.writes += 1
        self._emit(
            "write",
            [index],
            message or f"Write {value} into position {index}",
            active=index,
        )
        return value

    def close_aux(self):
        self.aux_left = None
        self.aux_right = None

    # ------------------------------------------------------------------ #
    # outcomes
    # ------------------------------------------------------------------ #
    def mark_sorted(self, *indices, message=None):
        for index in indices:
            self.sorted_slots.add(index)
        values = ", ".join(str(self.array[i]) for i in indices)
        self._emit(
            "sorted", list(indices), message or f"{values} is now in final position"
        )

    def found(self, index, message=None):
        self.set_state(found=index)
        self._emit(
            "found",
            [index],
            message or f"Found {self.array[index]} at position {index}",
            active=index,
        )

    def not_found(self, message="Value is not in the array"):
        self.set_state(found=-1)
        self._emit("notfound", [], message)

    def done(self, message="Array is fully sorted"):
        self.sorted_slots = set(range(len(self.array)))
        self.clear_pointers()
        self.close_aux()
        self._emit("done", [], message)

    # ------------------------------------------------------------------ #
    # result
    # ------------------------------------------------------------------ #
    def result(self, meta=None):
        return {
            "kind": "array",
            "array": list(self.array),
            "swapped_array": list(self.array),  # legacy key
            "steps": self.steps,
            "stats": {
                "comparisons": self.comparisons,
                "writes": self.writes,
                "steps": len(self.steps),
            },
            "meta": meta or {},
        }


# Backwards-compatible alias: the original module exported `StepRecorder`.
StepRecorder = ArrayStepRecorder
