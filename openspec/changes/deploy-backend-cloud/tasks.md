## 1. Infrastructure Preparation

- [x] 1.1 Create a `render.yaml` Blueprint file at the root of the repository to define the FastAPI Web Service and Celery Background Worker Service.
- [x] 1.2 Verify that the `backend/Dockerfile` correctly isolates system dependencies and sets up the Python environment.

## 2. Platform-as-a-Service Configuration

- [ ] 2.1 Connect the GitHub repository to the Render PaaS dashboard.
- [ ] 2.2 Configure the Render Environment Group or service-specific environment variables for `DATABASE_URL` (using the Supabase connection pooler URL) and `REDIS_URL` (Upstash Redis URL).
- [ ] 2.3 Set `FRONTEND_URL` in the Render environment variables to the exact Vercel frontend URL.

## 3. Frontend Integration

- [ ] 3.1 Update the Vercel frontend deployment environment variable `VITE_API_BASE_URL` to point to the newly deployed Render Web Service URL.
- [ ] 3.2 Trigger a new deployment on Vercel to pick up the updated environment variable.

## 4. Verification

- [ ] 4.1 Perform a complete user registration and login flow via the Vercel frontend to verify FastAPI-to-Supabase connectivity in the cloud.
- [ ] 4.2 Request a new batch of product identities via the Vercel frontend to verify Celery-to-Upstash connectivity in the cloud.
- [ ] 4.3 Run `openspec validate deploy-backend-cloud --type change --strict` to ensure the change artifacts are valid before archiving.
