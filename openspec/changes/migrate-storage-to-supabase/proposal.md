## Why

Currently, image uploads (project cover images and physical product verification photos) are saved to the local filesystem (`uploads/` directory). Because the backend is deployed on a cloud PaaS with an ephemeral filesystem, these uploads are lost whenever the server restarts or deploys. Migrating to a durable cloud object storage solution (Supabase Storage) is essential for production data persistence.

## What Changes

- Refactor `save_project_cover_image` to push image bytes directly to a Supabase Storage bucket.
- Refactor product verification uploads to use Supabase Storage.
- Return public Supabase Storage URLs to the frontend instead of local filesystem routes.
- **BREAKING**: Remove the FastAPI `StaticFiles` mount that served images from the local `/uploads` path.

## Capabilities

### New Capabilities
- `cloud-object-storage`: Upload, store, and serve user-generated images from a durable cloud storage bucket.

### Modified Capabilities
- `project-cover-image`: Modified to support saving and retrieving project cover images via cloud URLs instead of local files.
- `verification`: Modified to upload verification event photos to cloud storage instead of local files.

## Impact

- **Dependencies**: Introduces the `supabase` Python client library to the backend.
- **Environment**: Requires `SUPABASE_URL` and `SUPABASE_KEY` configured in the cloud environment.
- **Systems**: Offloads static asset hosting from the FastAPI server to Supabase CDN, improving performance and scalability.
