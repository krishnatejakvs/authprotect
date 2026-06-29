# 0008: Hybrid PaaS Deployment Architecture

- Status: accepted
- Date: 2026-06-29

## Context
The AuthProtect platform currently runs on localhost for development. We need a cloud deployment architecture to make the platform accessible to end-users, stakeholders, and testers. The system consists of a React SPA, a FastAPI backend, a Celery worker, PostgreSQL, and Redis. We considered deploying on raw VPS (e.g., DigitalOcean Droplets) using Docker Compose, or using managed Platform-as-a-Service (PaaS) providers.

## Decision
We will adopt a Hybrid PaaS Deployment Architecture. The frontend React SPA will be deployed on a static hosting provider (e.g., Vercel or Netlify). The FastAPI backend and Celery workers will be containerized and deployed to a PaaS that supports Docker and background workers natively (e.g., Render or Railway). Stateful services (PostgreSQL and Redis) will be hosted on managed database providers (e.g., Supabase/Neon and Upstash).

## Consequences
- **Positive**: Significantly reduced operational overhead. No need to manage server patching, SSL certificates, or database backups.
- **Positive**: Automatic CI/CD integrations with GitHub.
- **Negative**: Higher potential cost at scale compared to raw VMs.
- **Negative**: Vendor lock-in to PaaS configuration formats, though mitigated by containerizing the backend.
