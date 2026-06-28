## Context

The Product Trust Platform requires a self-serve administration layer to allow customer organizations to manage their own structure and access model. Without this, organizations cannot onboard, collaborate, or establish reliable scope boundaries for downstream capabilities. This design covers the backend models, frontend UI structure, and authorization model for tenant and user management.

## Goals / Non-Goals

**Goals:**
- Implement the core database models (User, Organization, Membership, Site, Project, ProjectSite, Invitation) in PostgreSQL using SQLAlchemy.
- Create REST API endpoints in FastAPI for CRUD operations on these models.
- Implement Role-Based Access Control (RBAC) middleware in FastAPI to enforce organization and site-level isolation.
- Build React frontend components (using TailwindCSS and ShadCN UI) for onboarding, authentication, and the administration dashboard.

**Non-Goals:**
- Implementing fine-grained permissions at the resource/action level (only `admin`, `site_manager`, `user` roles for now).
- Cross-organization project-site linking.
- SSO and enterprise identity federation.
- Audit logs and compliance reporting (beyond basic entity creation timestamps).

## Decisions

**1. Data Model Strategy**
- **Decision:** Use a single database with a multi-tenant schema where tenant isolation is enforced logically via `organization_id` foreign keys on all top-level tenant resources (Site, Project, Membership, Invitation).
- **Rationale:** The application is early stage. Logical isolation is simpler to implement and maintain than separate schemas or databases per tenant, keeping operations light while providing sufficient isolation via the application layer (FastAPI).

**2. Authorization Middleware**
- **Decision:** Implement a FastAPI dependency (e.g., `get_current_user_with_role`) that verifies the user's role against the `organization_id` provided in the path or header.
- **Rationale:** Centralizing authorization logic in a dependency prevents repetitive access-check code in every endpoint and ensures tenant boundaries are respected consistently.

**3. Project-Site Mapping**
- **Decision:** Use a many-to-many relationship (the `ProjectSite` association table) to link Projects and Sites, rather than assigning a Project strictly to one Site.
- **Rationale:** A product authentication initiative (Project) might span multiple physical locations (Sites) within the same organization. This mapping allows flexible operational structures.

**4. Soft Deletes**
- **Decision:** Implement soft deletes (archiving) via a `status` column for Sites and Projects rather than hard deletions.
- **Rationale:** Hard deleting these entities would cascade and destroy historical operational data (like Product Identities linked to a project/site), which is critical for audits in anti-counterfeiting workflows.

## Risks / Trade-offs

- **Risk: Authorization Bypass** → Ensure all endpoints accepting an `organization_id` or acting on organization resources use the authorization dependency. Write robust unit tests verifying that users cannot access data across tenants or outside their role permissions.
- **Risk: Multi-organization Context Switching UX** → Design the frontend state (e.g., React Context) to clearly track and display the *active* organization context. Require explicit UI selection when a user belongs to multiple organizations.

## Migration Plan

- Deploy SQLAlchemy migrations (`alembic upgrade head`) to create the new tables.
- No legacy data migration is required as this is the foundational release.
