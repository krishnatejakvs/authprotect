## 1. Infrastructure Provisioning

- [x] 1.1 Provision managed PostgreSQL database (e.g., Supabase, Neon)
- [x] 1.2 Provision managed Redis instance (e.g., Upstash)
- [x] 1.3 Record database and redis connection URIs for use in backend environment variables

## 2. Backend Containerization & Deployment

- [x] 2.1 Add `Dockerfile` to the `backend/` directory for FastAPI and Celery
- [x] 2.2 Update `backend/app/main.py` to accept CORS origins from environment variable (`FRONTEND_URL`)
- [x] 2.3 Configure PaaS (e.g., Render/Railway) web service for the FastAPI backend, setting `DATABASE_URL` and `REDIS_URL`
- [x] 2.4 Configure PaaS worker service for the Celery process, using the same codebase/image but with celery command
- [x] 2.5 Run database migrations (`alembic upgrade head`) against the production database

## 3. Frontend Deployment

- [x] 3.1 Update frontend to consume `VITE_API_BASE_URL` environment variable for API requests
- [x] 3.2 Connect Vercel/Netlify to the GitHub repository
- [x] 3.3 Configure build settings (`npm run build`, output dir `dist`) and inject `VITE_API_BASE_URL` pointing to deployed backend
- [x] 3.4 Deploy frontend and verify communication with the backend

## 4. Verification

- [x] 4.1 Test user registration/login flow on the production URL
- [x] 4.2 Test a background task trigger to ensure Celery and Redis are functioning correctly
- [x] 4.3 Run `openspec validate publish-online --type change --strict` to ensure change artifacts are valid
