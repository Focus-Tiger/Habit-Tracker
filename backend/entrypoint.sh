#!/bin/sh
set -e

python -c "
import os
import time
from sqlalchemy import create_engine

url = os.environ.get('DATABASE_URL')
for attempt in range(30):
    try:
        create_engine(url).connect().close()
        break
    except Exception as exc:
        print(f'database not ready yet ({exc}), retrying...')
        time.sleep(1)
else:
    raise SystemExit('database never became available')
"

alembic upgrade head
python -m app.seed

exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload --reload-dir app
