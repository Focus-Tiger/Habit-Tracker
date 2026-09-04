from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .habits import router as habits_router

app = FastAPI(title="Habit Tracker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(habits_router)


@app.get("/health")
def health():
    return {"status": "ok"}
