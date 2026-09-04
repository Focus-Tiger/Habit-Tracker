"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function DashboardPage() {
  const [userId, setUserId] = useState<number | null>(null);
  const [habits, setHabits] = useState<any[]>([]);
  const [checkingInId, setCheckingInId] = useState<number | null>(null);
  const [newHabitName, setNewHabitName] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/users`)
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          setUserId(data[0].id);
        }
      })
      .catch((err) => {
        console.log("failed to load user", err);
      });
  }, []);

  useEffect(() => {
    if (userId === null) return;
    fetch(`${API_URL}/habits`, {
      headers: { "X-User-Id": String(userId) },
    })
      .then((res) => res.json())
      .then((habitsData) => setHabits(habitsData))
      .catch((err) => {
        console.log("failed to load habits", err);
      });
  }, [userId]);

  function handleCheckin(habitId: number) {
    setCheckingInId(habitId);
    fetch(`${API_URL}/habits/${habitId}/checkins`, {
      method: "POST",
      headers: { "X-User-Id": String(userId) },
    })
      .then((res) => res.json())
      .then((updatedHabit) => {
        setHabits((prev) =>
          prev.map((h) => (h.id === updatedHabit.id ? updatedHabit : h))
        );
        setCheckingInId(null);
      })
      .catch((err) => {
        console.log("checkin failed", err);
        setCheckingInId(null);
      });
  }

  function handleAddHabit() {
    if (!newHabitName.trim()) return;
    fetch(`${API_URL}/habits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User-Id": String(userId),
      },
      body: JSON.stringify({ name: newHabitName }),
    })
      .then((res) => res.json())
      .then((habit) => {
        setHabits((prev) => [...prev, habit]);
        setNewHabitName("");
      })
      .catch((err) => {
        console.log("failed to add habit", err);
      });
  }

  function handleRemoveHabit(habitId: number) {
    fetch(`${API_URL}/habits/${habitId}`, {
      method: "DELETE",
      headers: { "X-User-Id": String(userId) },
    })
      .then(() => {
        setHabits((prev) => prev.filter((h) => h.id !== habitId));
      })
      .catch((err) => {
        console.log("failed to remove habit", err);
      });
  }

  return (
    <main style={{ padding: "2rem" }} className="min-h-screen bg-beige-100">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <img src="/images/tiger-logo.png" alt="Habit Tracker" className="h-10 w-10" />
          <h1 className="text-2xl font-semibold text-brand-900">Habit Tracker</h1>
        </div>

        <div className="mb-6 flex gap-2">
          <input
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            placeholder="New habit name"
            className="border rounded px-2 py-1 flex-1"
          />
          <button
            onClick={handleAddHabit}
            className="bg-brand-500 hover:bg-brand-700 text-white px-4 py-2 rounded"
          >
            Add habit
          </button>
        </div>

        <div className="grid gap-4">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className="bg-white rounded-lg p-4 flex items-center justify-between border"
              style={{ borderColor: "#e7dfd3" }}
            >
              <div>
                <div className="font-medium text-brand-900">{habit.name}</div>
                <div className="text-sm" style={{ color: "#946b3f" }}>
                  Current streak: {habit.current_streak} days &middot; best {habit.longest_streak}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCheckin(habit.id)}
                  disabled={checkingInId === habit.id}
                  className="bg-brand-500 hover:bg-brand-700 text-white px-4 py-2 rounded"
                >
                  Check in
                </button>
                <button
                  onClick={() => handleRemoveHabit(habit.id)}
                  className="text-sm text-brand-700 hover:text-brand-900 px-2"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
