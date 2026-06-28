from fastapi import APIRouter
from app.api.endpoints import organizations, sites, projects, project_sites, invitations, auth, batches

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(organizations.router, prefix="/organizations", tags=["organizations"])
api_router.include_router(sites.router, prefix="/sites", tags=["sites"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(project_sites.router, prefix="/project-sites", tags=["project-sites"])
api_router.include_router(invitations.router, prefix="/invitations", tags=["invitations"])
api_router.include_router(batches.router, prefix="/batches", tags=["batches"])
