## Why

Currently, the AuthProtect frontend and backend are completely decoupled. The frontend uses mocked data and simulated timeouts, while the backend is a fully functional FastAPI application. To make the application functional end-to-end and testable as a complete system, we need to wire the frontend to make actual HTTP requests to the backend APIs and manage authentication state natively in the React application.

## What Changes

- Introduce `axios` (or native `fetch` wrappers) as the primary HTTP client in the frontend.
- Implement an authentication provider/store (e.g., using React Context or Zustand) to securely manage and persist the JWT access token.
- Implement Axios interceptors to automatically attach the `Authorization: Bearer <token>` header to all outgoing API requests.
- Replace all mocked `setTimeout` logic and dummy data arrays in the authentication flows (`Login`, `Signup`) and the dashboard pages (`OrganizationHome`, `OrganizationSettings`, `Sites`, `Projects`) with real API calls to the FastAPI backend.
- Handle API loading states, error responses, and token expiration (e.g., redirecting to login on 401 Unauthorized).

## Capabilities

### New Capabilities
- `frontend-api-integration`: Establishes the architecture for frontend-to-backend communication, JWT token management, and global API error handling.

### Modified Capabilities
- `organizations`: Updates the frontend implementation of organization management to use the real API instead of mocks.

## Impact

- **Frontend Architecture:** Significant update to how data is fetched and state is managed in the React app.
- **Security:** Involves storing JWT tokens in the browser (likely in `localStorage` or `sessionStorage` for this phase, though HTTP-only cookies could be considered for production).
- **Dependencies:** Addition of `axios` (if used) and potentially a data-fetching library like `react-query` or `swr` for state management, though we can start with simple React state.
