"""initial schema

Revision ID: 0001
Revises:
Create Date: 2026-09-04

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        sa.text("""
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
    """)
    )

    op.execute(
        sa.text("""
        CREATE TABLE IF NOT EXISTS habits (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id),
            name TEXT NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
            current_streak INTEGER NOT NULL DEFAULT 0,
            longest_streak INTEGER NOT NULL DEFAULT 0
        )
    """)
    )
    op.execute(
        sa.text("CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits (user_id)")
    )

    op.execute(
        sa.text("""
        CREATE TABLE IF NOT EXISTS checkins (
            id SERIAL PRIMARY KEY,
            habit_id INTEGER NOT NULL REFERENCES habits(id),
            checked_at TIMESTAMP NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
    """)
    )
    op.execute(
        sa.text("CREATE INDEX IF NOT EXISTS idx_checkins_habit_id ON checkins (habit_id)")
    )


def downgrade() -> None:
    op.execute(sa.text("DROP INDEX IF EXISTS idx_checkins_habit_id"))
    op.execute(sa.text("DROP TABLE IF EXISTS checkins"))
    op.execute(sa.text("DROP INDEX IF EXISTS idx_habits_user_id"))
    op.execute(sa.text("DROP TABLE IF EXISTS habits"))
    op.execute(sa.text("DROP TABLE IF EXISTS users"))
