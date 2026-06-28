## 1. Setup API Client and Core Context

- [x] 1.1 Install `axios` in the frontend project.
- [x] 1.2 Create an `api.ts` utility file that configures an Axios instance pointing to the FastAPI backend URL with common headers.
- [x] 1.3 Create an `AuthContext.tsx` provider to manage global authentication state (token storage, user data, login/logout functions) using `localStorage`.
- [x] 1.4 Update the Axios instance to attach the JWT token (if available in context/localStorage) to all outgoing requests.
- [x] 1.5 Add a global Axios interceptor to catch 401 Unauthorized errors and trigger the logout flow.

## 2. Integrate Authentication Pages

- [x] 2.1 Update `Signup.tsx` to call the real `/api/v1/users/` endpoint and handle registration success/errors.
- [x] 2.2 Update `Login.tsx` to call the `/api/v1/auth/access-token` endpoint (using OAuth2 form data as required by FastAPI), obtain the JWT token, and update `AuthContext`.
- [x] 2.3 Update `RequireAuth.tsx` to use the actual `AuthContext` state instead of mocked booleans.

## 3. Integrate Dashboard Data

- [x] 3.1 Update `OrganizationContext.tsx` to fetch the active organization and user role from `/api/v1/organizations/me` or the user profile endpoint when the dashboard loads.
- [x] 3.2 Update `CreateOrganization.tsx` to call the POST `/api/v1/organizations/` endpoint upon submission and redirect to the dashboard.
- [x] 3.3 Update `OrganizationSettings.tsx` to fetch real users and pending invitations for the organization, and wire up the invite submission form.
- [x] 3.4 Update `Sites.tsx` to fetch real site locations and wire up the creation form.
- [x] 3.5 Update `Projects.tsx` to fetch real project data and wire up the project creation action.

## 4. End-to-End Testing

- [x] 4.1 Perform a complete manual walkthrough of the user journey: signup -> login -> create organization -> invite user -> view dashboard.
- [x] 4.2 Verify JWT persistence across page reloads and proper redirection on logout or token expiration.
