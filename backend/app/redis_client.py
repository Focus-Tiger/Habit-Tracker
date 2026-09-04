import os

import redis

REDIS_URL = os.environ.get("REDIS_URL", "redis://redis:6379/0")
redis_client = redis.Redis.from_url(REDIS_URL, decode_responses=True)


def check_rate_limit(
    user_id: int, action: str = "checkin", max_attempts: int = 10, window_seconds: int = 60
) -> bool:
    """Returns True if the request is allowed, False if the user should back off.

    Simple fixed-window counter, not a lock. Good enough to stop a client from
    hammering the check-in button.
    """
    key = f"ratelimit:{action}:{user_id}"
    current = redis_client.incr(key)
    if current == 1:
        redis_client.expire(key, window_seconds)
    return current <= max_attempts
