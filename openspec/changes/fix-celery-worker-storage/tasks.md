## 1. Implementation
- [x] 1.1 Import `urllib.request` and `app.services.storage.supabase` in `backend/app/worker.py`.
- [x] 1.2 Refactor `generate_batch_identities_task` to download `cover_image_url` to a `/tmp/` file.
- [x] 1.3 Refactor the loop to embed the hash, upload the generated local file to Supabase under `products/{uuid}.jpg`, and save the public URL to `AuthenticationToken.image_url`.
- [x] 1.4 Add `os.remove` to clean up the temporary product image file.
