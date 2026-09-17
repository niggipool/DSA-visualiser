from .structure_builder import StructureStepRecorder
from ..metadata import METADATA

DEFAULT_OPS = [
    {"op": "insert_head", "value": 30},
    {"op": "insert_head", "value": 12},
    {"op": "insert_tail", "value": 7},
    {"op": "insert_at", "value": 99, "index": 2},
    {"op": "search", "value": 7},
    {"op": "delete", "value": 99},
    {"op": "search", "value": 42},
]


def run_linked_list(operations=None):
    rec = StructureStepRecorder("linked-list")
    operations = operations or DEFAULT_OPS
    rec.emit("init", "Empty list. head is null.")

    def update_pointers():
        if rec.cells:
            rec.set_pointers(head=0, tail=len(rec.cells) - 1)
        else:
            rec.set_pointers(head=None, tail=None)

    def traverse_to(limit, purpose):
        """Emit one step per pointer hop, up to `limit` nodes."""
        for position in range(min(limit, len(rec.cells))):
            cell = rec.cells[position]
            rec.emit("traverse", f"{purpose}: hop to node {position} ({cell['value']})", [cell["id"]])

    for operation in operations:
        op = operation.get("op")
        value = operation.get("value")
        index = operation.get("index", 0)
        rec.operations += 1

        if op == "insert_head":
            cell = rec.new_cell(value)
            rec.cells.insert(0, cell)
            update_pointers()
            rec.emit("insert", f"Insert {value} at the head. O(1), no traversal needed.", [cell["id"]])

        elif op == "insert_tail":
            traverse_to(len(rec.cells), "Walk to the tail")
            cell = rec.new_cell(value)
            rec.cells.append(cell)
            update_pointers()
            rec.emit("insert", f"Link {value} after the old tail", [cell["id"]])

        elif op == "insert_at":
            position = max(0, min(index, len(rec.cells)))
            traverse_to(position, f"Walk to position {position}")
            cell = rec.new_cell(value)
            rec.cells.insert(position, cell)
            update_pointers()
            rec.emit("insert", f"Splice {value} in at position {position}", [cell["id"]])

        elif op == "search":
            found = False
            for position, cell in enumerate(rec.cells):
                rec.emit("compare", f"Is node {position} ({cell['value']}) equal to {value}?", [cell["id"]])
                if cell["value"] == value:
                    rec.emit("found", f"Found {value} at position {position}", [cell["id"]], output=position)
                    found = True
                    break
            if not found:
                rec.emit("notfound", f"Reached the end without finding {value}", [], output=-1)

        elif op == "delete":
            target = None
            for position, cell in enumerate(rec.cells):
                rec.emit("compare", f"Is node {position} ({cell['value']}) equal to {value}?", [cell["id"]])
                if cell["value"] == value:
                    target = position
                    break
            if target is None:
                rec.emit("notfound", f"{value} is not in the list, nothing to delete")
                continue
            cell = rec.cells[target]
            rec.emit("unlink", f"Point the previous node past {value}", [cell["id"]])
            rec.cells.pop(target)
            update_pointers()
            rec.emit("delete", f"Removed {value}", [], output=value)

    rec.emit("done", f"Finished with {len(rec.cells)} node(s)")
    return rec.result(METADATA["linked-list"])
