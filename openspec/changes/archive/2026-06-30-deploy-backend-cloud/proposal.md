## Why

Currently, the frontend application is successfully deployed to Vercel, and our managed databases (Supabase Postgres and Upstash Redis) are live in the cloud. However, the FastAPI backend and Celery background workers are still running locally on the developer's machine. To make the AuthProtect AI platform fully functional and available over the internet, we must deploy these backend services to a cloud provider. 

## What Changes

- Deploy the FastAPI backend application as a web service on a cloud Platform-as-a-Service (PaaS) like Render.
- Deploy the Celery worker as a background service on the same PaaS infrastructure.
- Configure production environment variables (`DATABASE_URL`, `REDIS_URL`, `FRONTEND_URL`) on the cloud provider.
- Update the frontend Vercel deployment's `VITE_API_BASE_URL` to point to the newly deployed backend URL instead of localhost.

## Capabilities

### New Capabilities
- `cloud-backend-deployment`: Defines the infrastructure requirements, deployment targets, and environment variable configurations needed to run the FastAPI and Celery processes in production.

### Modified Capabilities


## Impact

- Infrastructure deployment configuration (e.g., `render.yaml` or Dockerfile updates if necessary).
- Vercel frontend environment configuration (`VITE_API_BASE_URL`).
- Local backend execution will be fully decoupled from the production Vercel frontend.
