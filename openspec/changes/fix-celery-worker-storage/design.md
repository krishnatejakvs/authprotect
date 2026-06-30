## Context
The Celery worker responsible for creating massive batches of cryptographically signed product identities generates the images locally and saves local file paths. Since migrating to Supabase Storage, the project cover images (the base image for the hash embedding) are fetched from Supabase CDN, and the product images need to be durably stored in Supabase.

## Goals / Non-Goals
**Goals:**
- Enable the worker to download the base image from a remote URL.
- Upload thousands of unique product images to Supabase securely and efficiently.
- Clean up local ephemeral storage so large batches don't crash the server.

**Non-Goals:**
- Completely rewriting the OpenCV steganography module, which still requires local files to process.

## Decisions
- Use `urllib.request.urlretrieve` to fetch the cover image into a `/tmp/` file.
- Iterate through the batch, embed the hash using `embed_hmac_dct` locally in `/tmp/`.
- Immediately upload each resulting file to `supabase.storage.from_("uploads").upload(path="products/...")` and read the public URL.
- Use `os.remove` to delete the temporary product image file to save disk space.

## Risks / Trade-offs
- **Network Latency overhead**: Fetching and uploading files across the internet will increase the time taken per item. Since it runs asynchronously in Celery, this is acceptable.

## Migration Plan
1. Refactor `backend/app/worker.py` directly.
2. Monitor background tasks to ensure memory limits are not hit.
