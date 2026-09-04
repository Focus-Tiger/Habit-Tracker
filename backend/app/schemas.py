from datetime import datetime
from typing import List

from pydantic import BaseModel


class UserOut(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        from_attributes = True


class CheckinOut(BaseModel):
    id: int
    habit_id: int
    checked_at: datetime

    class Config:
        from_attributes = True


class HabitOut(BaseModel):
    id: int
    user_id: int
    name: str
    created_at: datetime
    current_streak: int
    longest_streak: int
    checkins: List[CheckinOut] = []

    class Config:
        from_attributes = True


class HabitCreate(BaseModel):
    name: str
