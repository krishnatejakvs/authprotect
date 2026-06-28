## ADDED Requirements

### Requirement: Global Products Navigation
The system SHALL provide a global "Products" page accessible from the main navigation (alongside Organizations, Sites, Projects). This page SHALL allow users to browse, view, and search across all generated batches and products based on their name, batch number, or linked site.

#### Scenario: User browses global products page
- **WHEN** an authorized user clicks "Products" in the main navigation
- **THEN** they see a comprehensive list/search interface for all generated batches and products across their assigned sites.

### Requirement: Project Products Navigation
The system SHALL provide a navigation mechanism from a Project's dashboard to a dedicated "Products" view where users can manage and generate product batches for that specific project.

#### Scenario: User accesses project products
- **WHEN** an authorized user clicks the "Products" action on a Project
- **THEN** the system navigates to the Project Products view for batch generation

## MODIFIED Requirements

### Requirement: Organization Creation and Admin Assignment
The system SHALL allow any verified user to create an Organization. The creator SHALL be automatically assigned the `admin` role for that Organization. The system SHALL automatically generate and securely store a unique cryptographic encryption key for the newly created Organization.

#### Scenario: Verified user creates organization
- **WHEN** a verified user submits the create organization form
- **THEN** the system creates the Organization, generates and stores a unique encryption key for the Organization, creates a Membership for the user with the `admin` role, and sets the active context to that Organization
