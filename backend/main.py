from fastapi import FastAPI

app= FastAPI()

@app.get("/")
def root():
    return {"message": "DSA API IS RUNNING"}