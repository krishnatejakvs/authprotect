# Administration Spec

## Purpose
Core tenancy, authentication, organization, user, site, and project management with RBAC.

## Requirements

### Requirement: Email Verification for Access
The system SHALL require every user to verify their email before they can access the dashboard. Unverified users SHALL be blocked.

#### Scenario: Unverified user attempts login
- **WHEN** a user logs in with correct credentials but their email is not verified
- **THEN** the system denies dashboard access and prompts them to complete verification

### Requirement: Organization Creation and Admin Assignment
The system SHALL allow any verified user to create an Organization. The creator SHALL be automatically assigned the `admin` role for that Organization.

#### Scenario: Verified user creates organization
- **WHEN** a verified user submits the create organization form
- **THEN** the system creates the Organization, creates a Membership for the user with the `admin` role, and sets the active context to that Organization

### Requirement: Cross-Tenant Isolation
The system SHALL enforce tenant isolation, ensuring users can only access data belonging to Organizations where they have an active Membership.

#### Scenario: User attempts to access another organization's data
- **WHEN** a user requests data for an Organization ID they do not belong to
- **THEN** the system returns a 403 Forbidden error

### Requirement: Site Creation
The system SHALL allow Organization Admins to create Sites within their Organization. A Site SHALL belong to exactly one Organization.

#### Scenario: Admin creates a site
- **WHEN** an Organization Admin submits a new Site request
- **THEN** the Site is created and associated with the Admin's Organization

### Requirement: Project Creation
The system SHALL allow authorized users to create Projects under an Organization. A Project SHALL belong to exactly one Organization. The Project record MAY include a reference to a `cover_image_url` serving as the base artwork for the project's products.

#### Scenario: Authorized user creates a project without cover image
- **WHEN** an authorized user submits a new Project request without an image
- **THEN** the Project is created and associated with the current Organization, with `cover_image_url` as null.

#### Scenario: Authorized user creates a project with cover image
- **WHEN** an authorized user uploads a cover image and submits the new Project request
- **THEN** the Project is created and the `cover_image_url` points to the uploaded image artifact.

### Requirement: Project-Site Mapping
The system SHALL allow Organization Admins to link a Project to one or more Sites within the same Organization. Cross-organization linking SHALL be blocked.

#### Scenario: Admin links project to site
- **WHEN** an Organization Admin requests to link a Project to a Site in their Organization
- **THEN** the mapping is created

#### Scenario: Admin attempts cross-organization linking
- **WHEN** an Organization Admin requests to link a Project to a Site belonging to a different Organization
- **THEN** the system blocks the request and returns a 400 Bad Request or 403 Forbidden error

### Requirement: Site Manager Visibility
The system SHALL restrict Site Managers to viewing only Sites explicitly assigned to them, and Projects linked to those assigned Sites.

#### Scenario: Site manager views projects
- **WHEN** a Site Manager requests the list of Projects
- **THEN** the system returns only Projects that are linked to the Sites assigned to that Site Manager

### Requirement: Soft Deletion of Sites and Projects
The system SHALL archive (soft delete) Sites and Projects instead of hard deleting them, preserving historical data and associations.

#### Scenario: Admin archives a site
- **WHEN** an Organization Admin archives a Site
- **THEN** the Site's status changes to archived, but its database record and existing Project mappings remain intact
