## ADDED Requirements

### Requirement: Cloud Project Cover Image
The system MUST store project cover images in a durable cloud object storage bucket.
Feature: project-cover-image

#### Scenario: Uploading a project cover image
- **GIVEN** an authenticated organization member requests to upload a project cover image
- **WHEN** the backend processes the upload
- **THEN** it MUST upload the image to the Supabase Storage bucket
- **AND** it MUST persist the public cloud URL to the database
- **AND** it MUST NOT save the image to the local filesystem
