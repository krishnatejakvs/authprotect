# Project Knowledge & Guidelines

This document tracks important architectural decisions, domain models, and lessons learned to prevent recurring mistakes during implementation.

## 1. Projects
- **Scope & Purpose:** Projects are strictly informational entities meant to identify what projects exist within an organization.
- **Data Model:** 
  - They should ONLY contain `name` and `description` (along with standard metadata like `id`, `organization_id`, `status`, `created_at`).
  - **Do NOT** add fields like `target_batch_size`, `quantity`, or `progress` to Projects. These concepts belong downstream (e.g. to Products or Batches under a project), not on the Project entity itself.
- **UI:** The Project creation screen and listing tables should only reflect Name, Description, and Status.

## 2. Organization & User Flow
- **Onboarding vs Dashboard:**
  - A new user signing up goes through the `/onboarding/organization` flow to create their first organization.
  - A user logging in goes to `/dashboard`.
  - The `DashboardLayout` must redirect to `/onboarding/organization` if the user has no active organization, ensuring they cannot access the main dashboard without an organization context.
- **Context Loading:** `OrganizationContext` must wait for `AuthContext` to finish loading (`isLoading` from `useAuth`) before determining if the user has an organization, otherwise a race condition triggers an unintended redirect on page refresh.

## 3. Email & Invitations
- **Current State:** The email service is not yet implemented. 
- **Workaround:** Frontend blocks for `email_verified` have been temporarily bypassed so developers can test the end-to-end integration flow without being locked out.
- **Pending Tasks:** The actual acceptance of an invitation requires a new API endpoint and a corresponding frontend page where users can input an invite token.

## 4. General Frontend Practices
- **Data Mapping:** When mapping backend data to the frontend, strictly adhere to the schemas defined in the backend (`schemas/*.py`). Using properties in the frontend that the backend doesn't return (like `.toLocaleString()` on an undefined number) causes React to crash with a white screen.
- **Design:** Keep UI premium, modern, and rich. Focus on light/dark mode compatibility (ensuring CTAs are visible in both), using glassmorphism, smooth animations, and clean typography as requested.

## 5. API Headers
- **FastAPI Headers Validation:** When sending custom headers to FastAPI endpoints that use `Header()` dependencies (like `x_organization_id`), the frontend must send the header as `x-organization-id`. Avoid using custom capitalization like `Organization-ID` because FastAPI strictly expects the exact header name mapping.
