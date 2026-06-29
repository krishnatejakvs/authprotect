## ADDED Requirements

### Requirement: Cloud Infrastructure Provisioning
The platform MUST be deployable to cloud infrastructure to be accessible over the internet.

#### Scenario: Platform deployment environments
- **GIVEN** the application needs to run outside of localhost
- **WHEN** the infrastructure is provisioned
- **THEN** a Vercel/Netlify environment is available for the React SPA
- **AND** a Render/Railway environment is available for the FastAPI backend and Celery worker
- **AND** managed instances of PostgreSQL and Redis are accessible to the backend

### Requirement: Environment Variable Configuration
The application MUST securely read configuration from environment variables for production environments.

#### Scenario: Production API URL configuration
- **GIVEN** the frontend application is deployed
- **WHEN** it attempts to communicate with the backend
- **THEN** it must use the `VITE_API_BASE_URL` environment variable pointing to the deployed backend URL

#### Scenario: Backend service connections
- **GIVEN** the backend and worker are deployed
- **WHEN** they start up
- **THEN** they must connect to the database using the `DATABASE_URL` environment variable
- **AND** they must connect to Redis using the `REDIS_URL` or `CELERY_BROKER_URL` environment variable

### Requirement: Cross-Origin Resource Sharing (CORS)
The backend API MUST be configured to only allow requests from authorized frontend domains.

#### Scenario: Frontend to Backend communication
- **GIVEN** the backend is running on a different domain than the frontend
- **WHEN** the frontend makes an API request
- **THEN** the backend must respond with CORS headers allowing the frontend's origin
- **AND** reject requests from unauthorized origins

## MODIFIED Requirements

## REMOVED Requirements
