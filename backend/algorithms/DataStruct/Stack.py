from .structure_builder import StructureStepRecorder
from ..metadata import METADATA

DEFAULT_OPS = [
    {"op": "push", "value": 12},
    {"op": "push", "value": 7},
    {"op": "push", "value": 30},
    {"op": "peek"},
    {"op": "pop"},
    {"op": "push", "value": 5},
    {"op": "pop"},
    {"op": "pop"},
]


def run_stack(operations=None):
    rec = StructureStepRecorder("stack")
    operations = operations or DEFAULT_OPS
    rec.emit("init", "Empty stack. Everything happens at the top.")

    for operation in operations:
        op = operation.get("op")
        value = operation.get("value")
        rec.operations += 1

        if op == "push":
            cell = rec.new_cell(value)
            rec.cells.append(cell)
            rec.set_pointers(top=len(rec.cells) - 1)
            rec.emit("push", f"Push {value} onto the top", [cell["id"]])

        elif op == "pop":
            if not rec.cells:
                rec.emit("error", "Cannot pop: the stack is empty")
                continue
            cell = rec.cells[-1]
            rec.emit("peek", f"The top holds {cell['value']}", [cell["id"]])
            rec.cells.pop()
            rec.set_pointers(top=len(rec.cells) - 1 if rec.cells else None)
            rec.emit("pop", f"Pop {cell['value']} off the stack", [], output=cell["value"])

        elif op == "peek":
            if not rec.cells:
                rec.emit("error", "Cannot peek: the stack is empty")
                continue
            cell = rec.cells[-1]
            rec.emit("peek", f"Peek: {cell['value']} is on top, nothing is removed", [cell["id"]], output=cell["value"])

    rec.emit("done", f"Finished with {len(rec.cells)} item(s) on the stack")
    return rec.result(METADATA["stack"])
