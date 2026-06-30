#!/bin/bash
# start.sh

# Start the Celery worker in the background
echo "Starting Celery worker..."
celery -A app.worker.celery_app worker --loglevel=info &

# Start the FastAPI web service in the foreground
echo "Starting FastAPI web service..."
uvicorn app.main:app --host 0.0.0.0 --port 8000
