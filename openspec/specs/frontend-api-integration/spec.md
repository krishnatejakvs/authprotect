# Frontend API Integration Spec

## Purpose
Establishes the architecture for frontend-to-backend communication, JWT token management, and global API error handling.

## Requirements

### Requirement: Frontend API Client
The frontend MUST use a centralized API client to make HTTP requests to the backend.

#### Scenario: Request configuration
- **WHEN** the frontend makes an API call
- **THEN** it uses the configured base URL pointing to the FastAPI backend
- **AND** it sets `Content-Type: application/json` headers where appropriate.

### Requirement: Authentication Token Management
The frontend MUST securely store and manage the JWT access token received upon successful login.

#### Scenario: Successful Login
- **WHEN** a user logs in with valid credentials
- **THEN** the API returns a JWT access token
- **AND** the frontend saves the token and updates the authentication state to logged in.

#### Scenario: Attaching Tokens to Requests
- **WHEN** an authenticated user makes an API request to a protected endpoint
- **THEN** the frontend automatically attaches the `Authorization: Bearer <token>` header to the request.

#### Scenario: Token Expiration and Logout
- **WHEN** the backend responds with a 401 Unauthorized error due to an expired or invalid token
- **THEN** the frontend automatically logs the user out and redirects them to the login page.
