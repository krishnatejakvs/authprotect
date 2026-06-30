# Capability: cloud-backend-deployment

## Purpose
TBD: Deploy the FastAPI backend and Celery worker to a cloud Platform-as-a-Service environment.

## Requirements

### Requirement: Application configuration via environment variables
The backend MUST dynamically configure all connections from environment variables provided by the PaaS environment.
Feature: cloud-backend-deployment

#### Scenario: Connecting to the production database
- **GIVEN** the FastAPI application is starting in a cloud PaaS environment
- **AND** the PaaS environment provides a valid `DATABASE_URL` for Supabase
- **WHEN** the backend attempts to connect to the database
- **THEN** it MUST use the provided `DATABASE_URL` connection string

#### Scenario: Connecting to the production cache
- **GIVEN** the Celery background worker is starting in a cloud PaaS environment
- **AND** the PaaS environment provides a valid `REDIS_URL` for Upstash Redis
- **WHEN** the Celery worker initializes
- **THEN** it MUST connect to the Redis broker specified in `REDIS_URL`

#### Scenario: Receiving API requests from the frontend
- **GIVEN** the frontend application is hosted on Vercel at a specific URL
- **AND** the PaaS environment provides the Vercel URL in `FRONTEND_URL` (or allows `*.vercel.app`)
- **WHEN** the Vercel frontend sends an API request to the backend
- **THEN** the backend MUST accept the request and respond with CORS headers allowing the frontend origin
