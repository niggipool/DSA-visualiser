
from typing import Any, Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from algorithms.metadata import METADATA

from algorithms.sorting.bubble_sort import bubble_sort
from algorithms.sorting.insertion_sort import insertion_sort
from algorithms.sorting.selection_sort import selection_sort
from algorithms.sorting.merge_sort import merge_sort
from algorithms.sorting.quick_sort import quick_sort
from algorithms.sorting.counting_sort import counting_sort


from algorithms.searching.linear_search import linear_search
from algorithms.searching.binary_search import binary_search

from algorithms.DataStruct.Stack import run_stack
from algorithms.DataStruct.Queue import run_queue
from algorithms.DataStruct.linked_list import run_linked_list



# Guard rails. Visualization stops being readable well before these limits, and
# step generation for the O(n^2) sorts grows fast.
MAX_ARRAY_SIZE = 24
MIN_VALUE = 1
MAX_VALUE = 999
MAX_TREE_NODES = 31
MAX_OPERATIONS = 30

app = FastAPI(title="DSA Visualizer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_origin_regex=r"https://dsa-visualiser(?:-[a-z0-9-]+)?\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



class ArrayInput(BaseModel):
    array: list[int] = Field(..., min_length=1)


class SearchInput(ArrayInput):
    target: int


class GraphInput(BaseModel):
    nodes: list[dict[str, Any]] | None = None
    edges: list[dict[str, Any]] | None = None
    start: str = "A"
    goal: str | None = None
    directed: bool = False


class TreeInput(BaseModel):
    values: list[int | None] | None = None
    order: Literal["preorder", "inorder", "postorder"] = "inorder"


class StructureInput(BaseModel):
    operations: list[dict[str, Any]] | None = None


DEFAULT_TREE = [50, 30, 70, 20, 40, 60, 80]


# --------------------------------------------------------------------------- #
# Validation
# --------------------------------------------------------------------------- #
def validate_array(array: list[int]) -> list[int]:
    if len(array) > MAX_ARRAY_SIZE:
        raise HTTPException(422, f"Array is limited to {MAX_ARRAY_SIZE} elements for visualization.")
    for value in array:
        if not MIN_VALUE <= value <= MAX_VALUE:
            raise HTTPException(422, f"Values must be between {MIN_VALUE} and {MAX_VALUE}. Got {value}.")
    return array




def validate_operations(operations: list | None) -> list | None:
    if operations is None:
        return None
    if len(operations) > MAX_OPERATIONS:
        raise HTTPException(422, f"At most {MAX_OPERATIONS} operations per run.")
    if not operations:
        raise HTTPException(422, "Add at least one operation.")
    return operations


# --------------------------------------------------------------------------- #
# Meta
# --------------------------------------------------------------------------- #
@app.get("/")
def root():
    return {"message": "DSA API IS RUNNING"}


@app.get("/api/algorithms")
def list_algorithms():
    return {"algorithms": list(METADATA.values())}




# --------------------------------------------------------------------------- #
# Sorting
# --------------------------------------------------------------------------- #
@app.post("/api/sorting/bubble")
def run_bubble(data: ArrayInput):
    return bubble_sort(validate_array(data.array))


@app.post("/api/sorting/insertion")
def run_insertion(data: ArrayInput):
    return insertion_sort(validate_array(data.array))


@app.post("/api/sorting/selection")
def run_selection(data: ArrayInput):
    return selection_sort(validate_array(data.array))


@app.post("/api/sorting/merge")
def run_merge(data: ArrayInput):
    return merge_sort(validate_array(data.array))


@app.post("/api/sorting/quick")
def run_quick(data: ArrayInput):
    return quick_sort(validate_array(data.array))

@app.post("/api/sorting/counting")
def run_counting(data: ArrayInput):
    return counting_sort(validate_array(data.array))





@app.post("/api/searching/linear")
def run_linear(data: SearchInput):
    return linear_search(validate_array(data.array), data.target)

@app.post("/api/searching/binary")
def run_binary(data: SearchInput):
    return binary_search(validate_array(data.array), data.target)



@app.post("/api/structures/stack")
def run_stack_route(data: StructureInput):
    return run_stack(validate_operations(data.operations))


@app.post("/api/structures/queue")
def run_queue_route(data: StructureInput):
    return run_queue(validate_operations(data.operations))

@app.post("/api/structures/linked-list")
def run_linked_list_route(data: StructureInput):
    return run_linked_list(validate_operations(data.operations))