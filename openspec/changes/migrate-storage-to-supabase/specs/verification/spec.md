## ADDED Requirements

### Requirement: Cloud Verification Photos
The system MUST store physical product verification photos in a durable cloud object storage bucket.
Feature: verification

#### Scenario: Uploading a verification photo
- **GIVEN** a consumer submits a physical photo for product verification
- **WHEN** the backend processes the upload
- **THEN** it MUST upload the image to the Supabase Storage bucket
- **AND** it MUST persist the public cloud URL to the verification session
- **AND** it MUST NOT save the image to the local filesystem
