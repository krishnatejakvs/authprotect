## 1. Database and Models

## 1. Database and Models

- [x] 1.1 Create database migration to add `encryption_key` to `organizations` table.
- [x] 1.2 Update SQLAlchemy `Organization` model to include `encryption_key`.
- [x] 1.3 Create database migrations for `batches`, `product_identities`, and `authentication_tokens` tables.
- [x] 1.4 Define SQLAlchemy models for Batch, ProductIdentity, and AuthenticationToken.

## 2. API Endpoints

- [x] 2.1 Update Organization creation POST endpoint to automatically generate and save a secure `encryption_key`.

- [x] 2.1 Create POST endpoint for batch generation in `app/api/endpoints/batches.py`.
- [x] 2.2 Create GET endpoints to retrieve batches for a project and product identities for a batch.

## 3. Background Workers Setup

- [x] 3.1 Install and configure Celery and Redis in the backend.
- [x] 3.2 Create background task function `generate_batch_identities` that iterates and generates identities.
- [x] 3.3 Create the DCT-based steganography utility to embed HMAC tokens into project cover images and upload to storage.

## 4. Frontend Integration

- [x] 4.1 Update Project listing / Project details page to include a "Products" navigation button.
- [x] 4.2 Create `ProjectProducts.tsx` page to display the list of batches.
- [x] 4.3 Implement a modal or form to "Generate New Batch" that calls the backend POST endpoint with batch name, site link, date/time, and quantity.
- [x] 4.4 Build polling or manual refresh mechanism to update batch generation status on the UI.
- [x] 4.5 Create the Global `Products.tsx` page and add "Products" to the main `DashboardLayout.tsx` navigation to browse and search all generated batches/products.
