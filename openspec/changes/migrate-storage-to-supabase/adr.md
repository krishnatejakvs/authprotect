## Context and Problem Statement

The application was initially built storing uploaded files (e.g., project cover images, verification photos) on the local filesystem (`uploads/` directory). However, with the migration to a cloud Platform-as-a-Service (Render), the filesystem is ephemeral, causing uploads to be lost upon redeployment. We need a durable storage solution that fits seamlessly with our existing stack.

## Decision Drivers

- Persistence across server restarts/deploys.
- Avoid introducing new third-party vendors if an existing vendor provides the capability.
- Maintain ability to strictly control and authorize uploads from the backend.
- Ease of integration with Python/FastAPI.

## Considered Options

1. **Supabase Storage**
2. **AWS S3**
3. **Local Filesystem with Persistent Volume**

## Decision Outcome

Chosen option: **Supabase Storage**, because we already use Supabase for PostgreSQL, and their Storage product is a thin wrapper over AWS S3 that integrates perfectly into our existing API key structure. We will use the `supabase-py` client library in the backend to stream multipart form uploads directly from FastAPI to the Supabase Storage bucket, and we will serve the images using Supabase's public URLs.

### Positive Consequences

- Zero data loss during PaaS deployments.
- Faster image load times on the frontend due to Supabase's built-in CDN.
- No need to configure a new AWS IAM policy or S3 bucket, consolidating our cloud footprint.

### Negative Consequences

- Uploading large images will block the backend slightly longer than saving locally, and requires the backend to buffer the file.
- The backend becomes hard-coupled to the `supabase-py` library for file operations.
