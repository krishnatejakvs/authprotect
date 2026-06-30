## Context

The backend currently stores image uploads (project covers, verification photos) locally in an `uploads/` directory on the server running FastAPI. The application is deployed to a cloud Platform-as-a-Service (PaaS) which has an ephemeral file system. Consequently, all uploaded images are lost when the container is stopped, restarted, or redeployed. We need a persistent cloud object storage solution. Since the project already leverages Supabase for PostgreSQL, adopting Supabase Storage is the natural architectural fit.

## Goals / Non-Goals

**Goals:**
- Migrate image upload functionality from the local filesystem to Supabase Storage.
- Serve images securely and directly from Supabase CDN to the frontend.
- Eliminate dependency on the local filesystem.

**Non-Goals:**
- Migrating existing images from the local filesystem to Supabase (assuming fresh start or ephemeral images don't need manual migration).
- Adding complex image processing (resizing, cropping) beyond what exists.

## Decisions

### Use `supabase-py` Client
Instead of manually crafting HTTP requests to the Supabase Storage REST API, we will use the official `supabase` Python package.
- **Rationale**: It integrates seamlessly with the existing `SUPABASE_URL` and `SUPABASE_KEY` configuration and handles the multipart form boundary encoding for file uploads gracefully.
- **Alternatives Considered**: Direct HTTP `requests` (higher maintenance overhead), AWS S3 (introduces a new third-party vendor when Supabase is already configured).

### Direct Uploads from Backend
The frontend will continue sending multipart form data to the FastAPI backend, which will then buffer the file in memory and upload it to Supabase Storage.
- **Rationale**: Minimal changes to the frontend upload logic. The backend can enforce strict authentication, authorization, and rate-limiting before the file touches the storage bucket.
- **Alternatives Considered**: Pre-signed URLs for direct frontend-to-Supabase uploads. While more performant for large files, this adds complexity (generating tokens, handling CORS, webhooks to confirm upload success) that is unnecessary for small image uploads.

## Risks / Trade-offs

- **Risk: Increased Request Latency** -> Image uploads now require a round-trip from the client to the backend, and then from the backend to Supabase Storage.
  - **Mitigation**: These are infrequent operations (uploading a cover image or taking a verification photo). The added latency (a few hundred milliseconds) is acceptable.
- **Risk: Memory Exhaustion** -> Buffering large images in the FastAPI backend before pushing to Supabase could spike RAM usage.
  - **Mitigation**: FastAPI `UploadFile` uses SpooledTemporaryFile which writes to disk if the file exceeds a certain size limit (typically 1MB). We can also enforce strict file size limits in the endpoints.

## Migration Plan

1. Install `supabase` library on the backend.
2. Manually create the target bucket (e.g., `uploads`) in the Supabase Dashboard and configure it for public access.
3. Deploy the backend changes to Render.
4. Verify end-to-end functionality.

## Open Questions

- **Resolved**: We will use a single `uploads` bucket, and logically separate images into folders like `projects/`, `products/`, and `verifications/` within the bucket.
