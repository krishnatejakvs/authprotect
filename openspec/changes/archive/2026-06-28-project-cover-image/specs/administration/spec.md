## MODIFIED Requirements

### Requirement: Project Creation
The system SHALL allow authorized users to create Projects under an Organization. A Project SHALL belong to exactly one Organization. The Project record MAY include a reference to a `cover_image_url` serving as the base artwork for the project's products.

#### Scenario: Authorized user creates a project without cover image
- **WHEN** an authorized user submits a new Project request without an image
- **THEN** the Project is created and associated with the current Organization, with `cover_image_url` as null.

#### Scenario: Authorized user creates a project with cover image
- **WHEN** an authorized user uploads a cover image and submits the new Project request
- **THEN** the Project is created and the `cover_image_url` points to the uploaded image artifact.
