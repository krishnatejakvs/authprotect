#!/bin/bash
# start.sh

# Start the Celery worker in the background (concurrency=1 to save memory on Render)
echo "Starting Celery worker..."
celery -A app.worker.celery_app worker --concurrency=1 --loglevel=info &

# Start the FastAPI web service in the foreground
echo "Starting FastAPI web service..."
uvicorn app.main:app --host 0.0.0.0 --port 8000
