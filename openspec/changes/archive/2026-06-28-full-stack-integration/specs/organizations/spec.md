## ADDED Requirements

### Requirement: Frontend Organization Context Integration
The frontend OrganizationContext MUST fetch the user's active organization and role from the backend API, replacing mock data.

#### Scenario: User loads dashboard
- **WHEN** the dashboard layout loads
- **THEN** it makes an API call to `/api/v1/organizations/me` (or similar) to fetch the user's active organization and role
- **AND** sets these values in the `OrganizationContext` for global use across the dashboard.
