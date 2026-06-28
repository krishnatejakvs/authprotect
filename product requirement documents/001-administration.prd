# PRD: Organization, Site & Project Administration

## Document Control

| Field | Value |
|---|---|
| Capability ID | CAP-001 |
| Capability Name | Administration |
| Related Skill | `skills/administration` |
| Product Area | Core Platform / Tenancy & Access |
| Status | Draft |
| Primary Audience | Product, Engineering, Design, QA, Customer Success |

## Overview

Organization, Site & Project Administration is the foundational capability that establishes tenancy, access control, and operational structure for the Product Trust Platform.

This capability enables a company to self-serve its setup on the platform: create an organization, invite teammates, define sites, and create projects directly under the organization. Sites are also created under the organization and can be linked to projects for operational tracking. Every future capability in the platform will execute in the context of an Organization, with authorization and data scope inherited through the hierarchy below.

**Hierarchy**

User → Organization → { Projects, Sites }

Projects and Sites exist as parallel entities under an Organization. A Project is organization-scoped and can be linked to one or more Sites.

## Why this matters

Without a robust administration layer, the platform cannot scale as a multi-tenant product. Organizations would require manual platform support to get started, collaboration would break down, and downstream capabilities such as Product Identity and verification workflows would not have a reliable scope boundary.

This capability is therefore not just an onboarding feature. It is the control plane for tenancy, authorization, resource ownership, and future feature expansion.

## Product goal

Enable organizations to onboard themselves onto the platform, manage their own users, organize work by site, and create projects without platform intervention.

## Success metrics

The capability is successful when:

- A new organization can complete onboarding end-to-end without internal support.
- Organization Admins can independently manage users, sites, and projects.
- Organization-scoped projects and sites are enforced consistently.
- Role-based access control is clear, predictable, and auditable.
- Future platform capabilities can safely scope data and permissions to Organization, Project, Site, and Project-Site mappings.

## Problem statement

The Product Trust Platform requires a self-serve, multi-tenant administration layer that allows customer organizations to manage their own structure and access model.

Today, without this layer:

- Organizations cannot onboard themselves.
- Users cannot easily collaborate within a shared tenant.
- Sites and projects cannot be structured in a scalable way.
- Project-to-site operational mapping cannot be modeled correctly.
- Future Product Identities and trust workflows cannot be scoped correctly.

## Product principles

- Self-serve first: Organizations should not need platform intervention for standard setup.
- Clear ownership: Every resource must have an unambiguous parent and permission boundary.
- Least privilege by default: Users should only see the organizations, sites, and projects assigned to them.
- Flexible operations model: Projects must support linkage to multiple sites within the same organization.
- Future-proof model: The tenancy structure must support future capabilities without redesign.
- Simple mental model: Admins should understand the hierarchy and permissions with minimal training.

## Scope

### In scope

#### 1. Authentication & onboarding

- User signup
- Email verification
- User login
- Password reset

#### 2. Organization management

- Create Organization
- View Organization
- Update Organization

#### 3. User management

- Invite users to an Organization
- Accept invitations
- Remove users
- Manage user roles

#### 4. Site management

- Create Site
- Update Site
- Archive Site

#### 5. Project management

- Create Projects under Organizations
- Update Project
- Archive Project
- Link Projects to one or more Sites
- Unlink Projects from Sites

### Out of scope

The following areas are explicitly excluded from this capability and should be handled in future capabilities:

- Product Identity
- Authentication tokens
- Verification
- Trust Events
- Analytics
- Product count tracking at site level

## Users and roles

### Organization Admin

Full administrative access within an Organization.

Can:

- Manage organization settings
- Manage users and invitations
- Manage sites
- Manage projects
- Link projects to sites
- Access all sites and projects within the organization

### Site Manager

Operational manager with access limited to assigned sites.

Can:

- View assigned sites
- View projects linked to assigned sites
- View users assigned to those sites
- Manage site-level project operations where permitted

Cannot:

- Manage organization settings
- Manage organization-wide users outside their permissions
- Create or manage sites unless explicitly elevated
- Create organization-level projects unless explicitly permitted

### User

Standard user with limited access.

Can:

- View assigned sites
- View projects linked to assigned sites or explicitly assigned to them

Cannot:

- Manage organization settings
- Manage users
- Create sites unless granted a higher role
- Create projects unless explicitly permitted

## User stories

| ID | User Story |
|---|---|
| US-001 | As a new user, I want to sign up and verify my email so that I can access the platform. |
| US-002 | As a user, I want to create an Organization so that I can manage my company's product authentication initiatives. |
| US-003 | As an Organization Admin, I want to invite team members so that they can collaborate on projects. |
| US-004 | As an Organization Admin, I want to create Sites so that work can be organized by physical location or business unit. |
| US-005 | As an Organization Admin, I want to create Projects under the Organization and link them to one or more Sites so that work and production can be organized appropriately. |
| US-006 | As a Site Manager, I want to see only the Sites assigned to me and the Projects linked to those Sites so that I focus only on my responsibilities. |

## Functional requirements

### 1. Authentication & onboarding

#### Signup

- A new user can register using name, email, and password.
- The system creates a User in an unverified state.
- The system sends a verification email.

#### Email verification

- A user must verify their email before accessing the dashboard.
- Verification links should expire after a configurable period.
- Users should be able to request a new verification email.

#### Login

- Verified users can log in with email and password.
- Unverified users are blocked from dashboard access and prompted to complete verification.

#### Password reset

- Users can request a password reset email.
- Reset links should expire after a configurable period.

### 2. Organization management

#### Create Organization

- Any verified user can create an Organization.
- The creator is automatically assigned as Organization Admin.
- A user may create or belong to multiple Organizations.

#### View Organization

- Members can view the Organization they belong to, subject to role permissions.

#### Update Organization

- Only Organization Admins can update organization details.

### 3. User management

#### Invite users

- Organization Admins can invite users by email.
- Every invitation includes organization, role, status, and expiry.
- Admins can resend expired or pending invitations.

#### Accept invitations

- Invited users can accept an invitation by authenticating or creating an account.
- If the invited email does not yet exist on the platform, the user should be able to sign up and then join the Organization.

#### Remove users

- Organization Admins can remove users from the Organization.
- A removed user immediately loses access to organization resources.

#### Manage roles

- Organization Admins can assign and update roles.
- Role updates should take effect immediately.

### 4. Site management

#### Create Site

- Only Organization Admins can create Sites.
- Each Site belongs to exactly one Organization.
- A Site can represent a plant, factory, region, or business unit.

#### Update Site

- Organization Admins can update Site name and description.

#### Archive Site

- Organization Admins can archive a Site instead of deleting it.
- Archived Sites should not appear in active workflows by default.
- Project mappings to archived Sites should be preserved for auditability and future reporting.

### 5. Project management

#### Create Project

- Authorized users can create a Project directly under an Organization.
- A Project belongs to exactly one Organization.
- A Project may be linked to one or more Sites within that same Organization.
- Project access is organization-scoped, while site-level visibility of operational activity is controlled through Project-Site mappings.

#### Update Project

- Authorized users can update project metadata such as name, description, and status.

#### Archive Project

- Authorized users can archive a Project instead of deleting it.
- Archived Projects remain accessible for historical reference based on permissions.

#### Link Project to Site

- Organization Admins can link a Project to one or more Sites in the same Organization.
- The system must prevent linking a Project to a Site in another Organization.
- Linking should be additive and support multi-site execution.

#### Unlink Project from Site

- Organization Admins can remove a Project-Site mapping.
- Removing a mapping must not delete the Project or the Site.
- Historical downstream records should remain intact if operational data exists against that mapping.

## Non-functional requirements

### Security

- Enforce tenant isolation across Organizations.
- Enforce role-based authorization on every protected action.
- Require verified email before dashboard access.
- Ensure invitation acceptance is bound to the invited email identity.
- Ensure cross-organization project-site linking is impossible.

### Scalability

- Support users belonging to multiple Organizations.
- Support Organizations with multiple Sites and many Projects.
- Support Projects linked to many Sites.
- Design permissions in a way that can extend to future resource types.

### Auditability

- Key admin actions should be traceable, including organization creation, invites, role changes, site creation, project creation, and project-site mapping changes.

### Usability

- Onboarding should be clear enough for a first-time admin to complete without support.
- Navigation should make Organization, Site, and Project context explicit at all times.
- Site-linked project visibility should be understandable to non-technical admins.

## Domain model

### User

Represents a platform user.

| Field | Type / Notes |
|---|---|
| id | Unique identifier |
| name | Full name |
| email | Unique email |
| email_verified | Boolean |
| created_at | Timestamp |

### Organization

Represents a customer tenant.

| Field | Type / Notes |
|---|---|
| id | Unique identifier |
| name | Organization name |
| created_at | Timestamp |

### Membership

Links a User to an Organization.

| Field | Type / Notes |
|---|---|
| id | Unique identifier |
| user_id | FK → User |
| organization_id | FK → Organization |
| role | `admin`, `site_manager`, `user` |

### Site

Represents a plant, factory, region, or business unit.

| Field | Type / Notes |
|---|---|
| id | Unique identifier |
| organization_id | FK → Organization |
| name | Site name |
| description | Optional text |
| status | Active / archived |

### Project

Represents a product authentication initiative.

| Field | Type / Notes |
|---|---|
| id | Unique identifier |
| organization_id | FK → Organization |
| name | Project name |
| description | Optional text |
| status | Lifecycle status |

### ProjectSite

Represents the mapping between a Project and one or more Sites within the same Organization.

| Field | Type / Notes |
|---|---|
| id | Unique identifier |
| project_id | FK → Project |
| site_id | FK → Site |
| created_at | Timestamp |

### Invitation

Represents a pending user invitation.

| Field | Type / Notes |
|---|---|
| id | Unique identifier |
| organization_id | FK → Organization |
| email | Invited email |
| role | Intended role |
| status | Pending / accepted / expired / revoked |
| expires_at | Timestamp |

## Business rules

| ID | Rule |
|---|---|
| BR-001 | Every User must verify email before accessing the dashboard. |
| BR-002 | The creator of an Organization becomes its Admin. |
| BR-003 | A User may belong to multiple Organizations. |
| BR-004 | An Organization may contain multiple Sites. |
| BR-005 | An Organization may contain multiple Projects. |
| BR-006 | A Site belongs to exactly one Organization. |
| BR-007 | A Project belongs to exactly one Organization. |
| BR-008 | A Project may be linked to one or more Sites within the same Organization. |
| BR-009 | Only Organization Admins may manage users. |
| BR-010 | Only Organization Admins may create Sites. |
| BR-011 | Only authorized users may create Projects. |
| BR-012 | Users can only access Sites assigned to them. |
| BR-013 | Site-linked project visibility for non-admin users is determined through Site assignment and Project-Site mapping. |
| BR-014 | Cross-organization Project-Site mappings are not allowed. |

## Authorization model

### Access matrix

| Action | Organization Admin | Site Manager | User |
|---|---|---|---|
| View organization | Yes | Limited | Limited |
| Update organization | Yes | No | No |
| Invite users | Yes | No | No |
| Remove users | Yes | No | No |
| Manage roles | Yes | No | No |
| Create site | Yes | No | No |
| Update site | Yes | Assigned only if permitted by policy; default No | No |
| Archive site | Yes | No | No |
| View site | All sites | Assigned sites only | Assigned sites only |
| Create project | Yes | No by default | No by default |
| Update project | Yes | Assigned projects only if permitted | No by default |
| Archive project | Yes | No by default | No by default |
| Link project to site | Yes | Assigned sites only if permitted | No |
| Unlink project from site | Yes | No by default | No |

### Permission logic

- Organization Admin has full access to all resources within the Organization.
- Site Manager access is constrained to assigned Sites and to Projects linked to those Sites, based on granted permissions.
- Standard Users can only view resources explicitly assigned to them.
- Projects are organization-scoped in this release; Site relevance is established through Project-Site mappings rather than project ownership.

## Key workflows

### 1. New organization onboarding

1. User signs up.
2. User verifies email.
3. User logs in.
4. User creates an Organization.
5. System assigns the creator as Organization Admin.
6. Admin creates Sites.
7. Admin creates Projects under the Organization.
8. Admin links Projects to one or more Sites.
9. Admin invites team members.

### 2. Team invitation flow

1. Organization Admin enters teammate email and role.
2. System creates Invitation with expiration.
3. Invitee receives email.
4. Invitee signs up or logs in.
5. Invitee accepts invitation.
6. System creates Membership and grants role-based access.

### 3. Project-to-site operational mapping

1. Organization Admin creates a Site.
2. Organization Admin creates a Project under the Organization.
3. Organization Admin links the Project to one or more Sites.
4. Site Manager is assigned to a Site.
5. Site Manager logs in and sees assigned Sites and the Projects linked to those Sites.
6. Downstream operational flows can use this mapping to track how many products from a Project are created at each Site.

## MVP decisions

To keep the first release focused and shippable:

- Roles are limited to three: `admin`, `site_manager`, `user`.
- Projects are organization-scoped.
- Projects can be linked to multiple Sites through an explicit mapping model.
- Sites and Projects are archived, not hard-deleted.
- Invitation flow is email-based only.
- Organization structure is a single level; nested sub-organizations are not supported.
- Product count tracking by Project-Site mapping is a downstream capability, not part of this release.

## Acceptance criteria

### User onboarding

- User can sign up.
- User receives verification email.
- User can verify email.
- User can log in after verification.
- Unverified users cannot access the dashboard.

### Organization

- Verified user can create an Organization.
- Creator automatically becomes Organization Admin.

### Users

- Admin can invite users.
- Invited users can accept invitations and join the Organization.
- Admin can remove users.
- Admin can update user roles.

### Sites

- Admin can create Sites.
- Sites belong to the Organization in which they were created.
- Archived Sites are excluded from default active views.

### Projects

- Authorized users can create Projects under the Organization.
- Projects can be linked to one or more Sites.
- Archived Projects are excluded from default active views.

### Authorization

- Admin can access all Sites and Projects within the Organization.
- Site Managers can access only assigned Sites and linked Projects, based on permissions.
- Standard Users can access only assigned resources.
- Unauthorized actions are blocked consistently.

### Mapping rules

- A Project can be linked to multiple Sites in the same Organization.
- A Site can be linked to multiple Projects in the same Organization.
- Cross-organization links are blocked.
- Removing a mapping does not delete the underlying Project or Site.

## Edge cases

- A user invited to multiple Organizations should be able to switch organization context after login.
- An invited email that already belongs to an existing user account should join through invitation acceptance, not account duplication.
- Expired invitations should not grant access and must be reissued or resent.
- Removing a user from one Organization must not affect access to other Organizations they belong to.
- Archiving a Site should preserve project mappings and history without exposing archived resources in active lists by default.
- Archiving a Project should preserve historical project-site associations for downstream audit and analytics use cases.

## Risks and open questions

### Risks

- Authorization complexity may increase quickly as more resource types are added.
- Multi-organization membership can create UX confusion if organization context is not explicit.
- Invitation misuse or incorrect role assignment can create avoidable security issues.
- Project visibility semantics may become confusing if organization-level access and site-linked access are not clearly separated in the UI.

### Open questions

- Should Site Managers be allowed to update Site metadata in a later release?
- Should Site Managers be allowed to create project-site mappings for their assigned sites?
- Should standard Users ever be allowed to create Projects under a governed workflow?
- What is the audit log depth required for compliance-sensitive customers?
- Should archived Sites automatically disable active Project-Site mappings, or remain independently managed?

## Future extensions

This capability should support the following future platform needs without major redesign:

- Product Identity scoped to Organization / Project / Site mapping
- Site-level production tracking for number of products created per Project
- Finer-grained permissions at resource or action level
- SSO and enterprise identity federation
- Audit logs and compliance reporting
- Organization-level billing and subscription controls
- Cross-site reporting for admins

## Release definition of done

This PRD is considered successfully delivered when:

- Self-serve onboarding works end-to-end.
- Organizations can manage their own users without platform intervention.
- Sites provide a reliable organizational boundary.
- Projects are correctly scoped to Organizations and linked to Sites through an explicit mapping model.
- Role-based access control is enforced consistently across all covered workflows.
- The tenancy model is ready to support future product capabilities.
