## Why
The Celery worker responsible for batch generation of product identities currently expects the project cover image to be stored on the local filesystem. After our migration to Supabase Storage, the `cover_image_url` is a public cloud URL, and saving product images locally is ephemeral. The worker fails or falls back to a dummy image and loses generated images on server restarts.

## What Changes
- Refactor `generate_batch_identities_task` in `backend/app/worker.py` to download the cover image from Supabase to `/tmp`.
- Embed the HMAC locally.
- Upload generated product identities to the `products/` folder in Supabase Storage.
- Clean up the `/tmp` folder.

## Capabilities
### New Capabilities
### Modified Capabilities

## Impact
- **Dependencies**: Uses standard `urllib.request` to download images. Relies on the `supabase-py` client configured in `app.services.storage`.
- **Systems**: Ensures product images are durably saved to the cloud, preventing data loss on Render restarts.
