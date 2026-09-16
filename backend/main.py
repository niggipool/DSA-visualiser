from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


from algorithms.sorting.bubble_sort import bubble_sort
from algorithms.sorting.insertion_sort import insertion_sort

app= FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ArrayInput(BaseModel):
    array: list[int]

@app.get("/")
def root():
    return {"message": "DSA API IS RUNNING"}

@app.post("/api/sorting/insertion")
def run_insertion_sort(data:ArrayInput):
    return insertion_sort(data.array)

@app.post("/api/sorting/bubble")
def run_bubble_sort(data:ArrayInput):
    return bubble_sort(data.array)
