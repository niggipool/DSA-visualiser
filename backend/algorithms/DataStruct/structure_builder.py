class StructureStepRecorder:
    def __init__(self, structure):
        self.structure = structure
        self.cells = []
        self.next_id = 0
        self.pointers = {}
        self.steps = []
        self.operations = 0

    # ------------------------------------------------------------------ #
    # cells
    # ------------------------------------------------------------------ #
    def new_cell(self, value, bucket=None):
        cell = {"id": self.next_id, "value": value, "bucket": bucket, "slot": 0}
        self.next_id += 1
        return cell

    def reindex(self):
        """Slot is the cell's position within its bucket (or the whole list)."""
        counters = {}
        for cell in self.cells:
            key = cell["bucket"]
            cell["slot"] = counters.get(key, 0)
            counters[key] = cell["slot"] + 1

    # ------------------------------------------------------------------ #
    # emit
    # ------------------------------------------------------------------ #
    def emit(self, step_type, message, highlight=(), output=None, extra=None):
        self.reindex()
        step = {
            "type": step_type,
            "structure": self.structure,
            "cells": [dict(cell) for cell in self.cells],
            "highlight": list(highlight),
            "pointers": dict(self.pointers),
            "message": message,
            "output": output,
        }
        if extra:
            step.update(extra)
        self.steps.append(step)

    def set_pointers(self, **named):
        for key, value in named.items():
            if value is None:
                self.pointers.pop(key, None)
            else:
                self.pointers[key] = value

    def result(self, meta=None, extra=None):
        payload = {
            "kind": "structure",
            "structure": self.structure,
            "steps": self.steps,
            "stats": {"operations": self.operations, "steps": len(self.steps)},
            "meta": meta or {},
        }
        if extra:
            payload.update(extra)
        return payload
