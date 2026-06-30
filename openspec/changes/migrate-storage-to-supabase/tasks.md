## 1. Environment and Dependencies

- [x] 1.1 Add `supabase` to `backend/requirements.txt` and run `pip install supabase`.
- [x] 1.2 Update `backend/app/core/config.py` to include `SUPABASE_URL` and `SUPABASE_KEY` from the environment.

## 2. Storage Service Refactoring

- [x] 2.1 Refactor `backend/app/services/storage.py` to initialize a Supabase client using the URL and Key from `config.py`.
- [x] 2.2 Update `save_project_cover_image(file: UploadFile, project_id: str)` to read the file bytes and upload them to `supabase.storage.from_("uploads").upload()`.
- [x] 2.3 Modify the return value to be the public URL of the uploaded image via `supabase.storage.from_("uploads").get_public_url()`.
- [x] 2.4 Implement a similar function or update existing logic for verification photos in `backend/app/api/endpoints/verifications.py`.

## 3. Server Configuration

- [x] 3.1 Remove the local `/uploads` static file mount `app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")` from `backend/app/main.py`.
- [x] 3.2 Remove any `os.makedirs` code related to local upload directories.

## 4. Verification

- [x] 4.1 Run the FastAPI server locally, providing the Supabase credentials in the `.env` file.
- [x] 4.2 Upload a project cover image through the frontend and verify it successfully uploads to the Supabase Storage bucket and renders correctly on the page.
- [x] 4.3 Run `openspec validate migrate-storage-to-supabase --type change --strict`.
