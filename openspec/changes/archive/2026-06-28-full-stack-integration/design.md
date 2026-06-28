## Context

The backend (FastAPI) and frontend (React) have been developed largely independently, relying on mocked data in the React components. To function as a real application, the frontend needs to fetch data from and post data to the backend. This change will establish the integration layer, managing HTTP requests, JWT token storage, and authentication state securely.

## Goals / Non-Goals

**Goals:**
- Replace frontend mocks with real HTTP requests to the FastAPI backend.
- Implement an API client configured for the backend's base URL.
- Implement JWT token storage in the browser (e.g., using localStorage).
- Automatically append the JWT token to outgoing authenticated API requests.
- Handle 401 Unauthorized errors gracefully (e.g., clearing the token and redirecting to the login page).

**Non-Goals:**
- Refresh token rotation (out of scope for this initial phase).
- Complex offline caching strategies or service workers.
- Replacing the entire state management with React Query (we will stick to basic React state or Context for now to keep the integration straightforward).

## Decisions

- **API Client:** We will use native `fetch` wrapped in a custom hook/utility OR `axios`. Given standard React patterns, `axios` is chosen for its simple interceptor setup (automatically adding the Bearer token to all requests).
- **Token Storage:** We will store the JWT access token in `localStorage`. While `httpOnly` cookies are more secure against XSS, `localStorage` is acceptable for this phase and integrates seamlessly with our current FastAPI setup (which issues a token in a JSON response, not a set-cookie header).
- **Authentication State:** A React Context (`AuthContext`) will manage the global authentication state (whether the user is logged in, their user ID, and the current token).

## Risks / Trade-offs

- **Risk:** XSS vulnerabilities allowing theft of the JWT from `localStorage`. 
  - **Mitigation:** Ensure React strictly escapes inputs (which it does by default) and avoid setting raw HTML. Future iterations can migrate to HTTP-only cookies if required by security policies.
- **Risk:** Stale data if we only use `useEffect` and simple state.
  - **Mitigation:** If data complexity grows, we can introduce `react-query` or `swr`. For now, we will use basic fetching and manual state updates.
