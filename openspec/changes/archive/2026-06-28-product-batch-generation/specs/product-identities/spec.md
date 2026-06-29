# Product Identities Spec

## ADDED Requirements

### Requirement: Batch Creation for Products
The system SHALL allow authorized users to generate a batch of products for a specific project. The user MUST provide the batch name, the linked site, the date and time, and the quantity of items for the batch. The system SHALL generate a unique, sequential product serial number for each item in the batch.

#### Scenario: Authorized user generates a batch
- **WHEN** an authorized user requests to generate a batch with a name, site link, date, and a quantity of 1000
- **THEN** the system creates a Batch record linked to the Project, and asynchronously generates 1000 Product Identity records linked to this Batch, each containing its sequential serial number.

### Requirement: Immutable Product Identities
The system SHALL ensure that once a Product Identity is created within a Batch, it cannot be modified or deleted, enforcing immutability.

#### Scenario: Attempting to modify a product identity
- **WHEN** a user or API attempts to update a Product Identity's core data
- **THEN** the system rejects the operation to maintain traceability.

### Requirement: Batch Listing and Status
The system SHALL provide a view listing all generated batches for a given project, including the total quantity, generation status, and creation date.

#### Scenario: User views project batches
- **WHEN** a user navigates to a project's batch listing
- **THEN** they see all historical batches and their current completion status.
