## 1. Database Schema and Storage Service

- [x] 1.1 Add `cover_image_url` column to `projects` table (Alembic migration).
- [x] 1.2 Implement a local StorageService to save uploaded files to `backend/uploads/projects` directory.
- [x] 1.3 Configure FastAPI static file serving for the `backend/uploads/` directory to serve images.

## 2. Backend API Endpoint

- [x] 2.1 Implement `POST /api/v1/projects/{project_id}/cover` endpoint to accept `multipart/form-data` uploads.
- [x] 2.2 Add validation for file type (JPEG/PNG/WEBP) and size limits.
- [x] 2.3 Update the Project database model and Pydantic schemas to include `cover_image_url`.

## 3. Frontend Project Model and API Client

- [x] 3.1 Update frontend Project interfaces/types to include `cover_image_url`.
- [x] 3.2 Update frontend `Projects` API client to support multipart file upload for the cover image.

## 4. Frontend UI Components

- [x] 4.1 Update Project Creation dialog to optionally accept an image file upload.
- [x] 4.2 Handle image upload submission (either alongside creation or as a sequential step).
- [x] 4.3 Update Projects listing UI to display the `cover_image_url` as a thumbnail or banner if present.
