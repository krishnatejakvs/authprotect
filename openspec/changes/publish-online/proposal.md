## Why

Currently, the AuthProtect project is configured exclusively for local development (`localhost`). To make the Product Trust Platform accessible to real users, stakeholders, and testers, it needs to be published online to a production environment. This change establishes the necessary infrastructure and configurations to deploy the frontend, backend, workers, and databases to the cloud.

## What Changes

- Introduce deployment configurations and CI/CD pipelines for the frontend application (Vite/React).
- Containerize and configure deployment for the FastAPI backend and Celery background workers.
- Set up a managed PostgreSQL database and a managed Redis cache/broker for production use.
- Update the backend's CORS configuration to allow requests from the production frontend domain.
- Standardize environment variable management for production settings (e.g., `DATABASE_URL`, `REDIS_URL`, `VITE_API_BASE_URL`).

## Capabilities

### New Capabilities
- `online-deployment`: Defines the deployment infrastructure, environment variables, and CI/CD behavior for publishing the platform online.

### Modified Capabilities


## Impact

- **Affected Code**: `backend/app/main.py` (CORS updates), frontend API client configuration.
- **New Files**: `backend/Dockerfile` (if containerizing), deployment scripts/configs depending on the chosen PaaS.
- **Dependencies**: New external dependencies on cloud providers (e.g., Vercel, Render, Supabase, Upstash).
