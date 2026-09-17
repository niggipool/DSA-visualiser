from .structure_builder import StructureStepRecorder
from ..metadata import METADATA

DEFAULT_OPS = [
    {"op": "enqueue", "value": 12},
    {"op": "enqueue", "value": 7},
    {"op": "enqueue", "value": 30},
    {"op": "peek"},
    {"op": "dequeue"},
    {"op": "enqueue", "value": 5},
    {"op": "dequeue"},
    {"op": "dequeue"},
]


def run_queue(operations=None):
    rec = StructureStepRecorder("queue")
    operations = operations or DEFAULT_OPS
    rec.emit("init", "Empty queue. Items enter at the rear and leave from the front.")

    def update_pointers():
        if rec.cells:
            rec.set_pointers(front=0, rear=len(rec.cells) - 1)
        else:
            rec.set_pointers(front=None, rear=None)

    for operation in operations:
        op = operation.get("op")
        value = operation.get("value")
        rec.operations += 1

        if op == "enqueue":
            cell = rec.new_cell(value)
            rec.cells.append(cell)
            update_pointers()
            rec.emit("enqueue", f"Enqueue {value} at the rear", [cell["id"]])

        elif op == "dequeue":
            if not rec.cells:
                rec.emit("error", "Cannot dequeue: the queue is empty")
                continue
            cell = rec.cells[0]
            rec.emit("peek", f"The front holds {cell['value']}", [cell["id"]])
            rec.cells.pop(0)
            update_pointers()
            rec.emit("dequeue", f"Dequeue {cell['value']} from the front", [], output=cell["value"])

        elif op == "peek":
            if not rec.cells:
                rec.emit("error", "Cannot peek: the queue is empty")
                continue
            cell = rec.cells[0]
            rec.emit("peek", f"Peek: {cell['value']} is at the front", [cell["id"]], output=cell["value"])

    rec.emit("done", f"Finished with {len(rec.cells)} item(s) in the queue")
    return rec.result(METADATA["queue"])
