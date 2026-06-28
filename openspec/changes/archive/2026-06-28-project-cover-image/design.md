## Context

Currently, the Projects domain model in the AuthProtect backend consists solely of text attributes (name, description, status). In the frontend, the UI represents projects in a tabular format. The user desires a "package cover" feature, where each project can have a unique image uploaded and displayed. This requires changes across the database schema, API, file storage strategy, and frontend UI.

## Goals / Non-Goals

**Goals:**
- Add database support to store an optional reference URL to a project cover image.
- Implement an API endpoint to upload a cover image associated with a specific project.
- Modify the frontend to support selecting and uploading an image during project creation.
- Update the frontend project listing and details views to render the project's cover image.

**Non-Goals:**
- Advanced image cropping/editing in the browser (basic upload is sufficient for MVP).
- Migrating to a complex cloud storage provider for the immediate milestone (local file storage is acceptable for the MVP phase, provided the abstraction is clean).
- Adding multiple cover images per project.

## Decisions

- **Storage Strategy:** For development and MVP, images will be stored locally on the backend server in a dedicated `uploads/` directory, and served via a FastAPI static file route. This avoids the immediate complexity and overhead of configuring an external object storage service like AWS S3.
- **Database Schema:** We will add a `cover_image_url` (String, nullable) column to the `projects` table. This stores the relative path or fully qualified URL to the served static image.
- **API Design:** We will introduce a new POST endpoint `/api/v1/projects/{project_id}/cover` that accepts `multipart/form-data` (a single `UploadFile`). The image will be processed, saved, and the `cover_image_url` on the project record will be updated. We choose a separate endpoint rather than complicating the initial `POST /projects` JSON payload with multipart forms to keep the REST structure clean.
- **Frontend Flow:** The frontend project creation dialog will be split into a two-step process or a single multipart form submission. For simplicity, we will modify the project creation endpoint to accept `multipart/form-data` instead of JSON if an image is provided, OR we can upload the image immediately after the project is created via a secondary API call. We will choose the secondary API call approach to reuse the existing `POST /projects` JSON endpoint.

## Risks / Trade-offs

- **Risk:** Local file storage doesn't scale horizontally if the backend runs in multiple containers or ephemeral environments (like Heroku).
  - **Mitigation:** Abstract the storage logic behind a `StorageService` interface so that we can easily swap local storage for S3 in production environments without changing the endpoint logic.
- **Risk:** Users uploading massive image files can exhaust server storage and bandwidth.
  - **Mitigation:** Implement a strict file size limit (e.g., 5MB) and validate the MIME type (e.g., `image/jpeg`, `image/png`, `image/webp`) on the backend before saving.
