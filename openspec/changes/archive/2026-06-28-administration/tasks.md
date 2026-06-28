## 1. Project Scaffolding

- [x] 1.1 Scaffold the FastAPI backend structure (app, core, api, models, schemas).
- [x] 1.2 Initialize PostgreSQL database connection and Alembic for migrations.
- [x] 1.3 Scaffold the React frontend using Vite (React + TypeScript).
- [x] 1.4 Install frontend dependencies (TailwindCSS, ShadCN UI, React Router, Zustand/Context).

## 2. Database & Models

- [x] 2.1 Create SQLAlchemy models for User, Organization, Membership, Site, Project, ProjectSite, and Invitation.
- [x] 2.2 Generate Alembic migration scripts for the new tables.
- [x] 2.3 Write unit tests to verify model creation and relationships.

## 3. API & Authorization

- [x] 3.1 Implement `get_current_user_with_role` FastAPI dependency to enforce RBAC (tenant and role checks).
- [x] 3.2 Create REST endpoints for Organization CRUD (create, read, update).
- [x] 3.3 Create REST endpoints for Site CRUD (create, update, soft delete).
- [x] 3.4 Create REST endpoints for Project CRUD (create, update, soft delete).
- [x] 3.5 Create REST endpoints for Project-Site mapping (link, unlink).
- [x] 3.6 Create REST endpoints for user invitations (invite, accept, list, remove, update role).

## 4. Authentication & Onboarding

- [x] 4.1 Implement user signup, login, password reset, and email verification workflows in the backend.
- [x] 4.2 Add email sending service/mock for verification and invitations.
- [x] 4.3 Ensure the dashboard blocks unverified users.

## 5. Frontend Integration

- [x] 5.1 Set up modern UI foundation (e.g., Tailwind config for curated color palettes, dark mode, typography like Inter/Outfit, and micro-animations setup).
- [x] 5.2 Build the Signup, Login, and Password Reset pages with premium aesthetics and smooth transitions.
- [x] 5.3 Build the Organization Onboarding flow (create organization) using interactive elements and skeleton loaders during state changes.
- [x] 5.4 Build the Organization Settings dashboard for managing Users and Invitations, including rich data tables and interactive empty states.
- [x] 5.5 Build the Sites and Projects configuration pages with glassmorphism touches and polished layouts.
- [x] 5.6 Add a global context/provider to manage the active Organization state and enforce UI restrictions based on user roles.
