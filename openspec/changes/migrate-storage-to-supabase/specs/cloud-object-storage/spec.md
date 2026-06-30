## ADDED Requirements

### Requirement: Cloud Object Storage
The system MUST upload all user-generated media to a durable cloud object storage bucket.
Feature: cloud-object-storage

#### Scenario: Uploading an image file
- **GIVEN** the backend is configured with valid Supabase Storage credentials
- **WHEN** the backend receives an image upload request from the frontend
- **THEN** it MUST stream the file to the `uploads` Supabase Storage bucket
- **AND** it MUST return the public CDN URL for the uploaded asset
