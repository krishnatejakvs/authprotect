from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.project_site import ProjectSite
from app.models.project import Project
from app.models.site import Site
from app.schemas.project_site import ProjectSiteLink, ProjectSiteResponse
from app.api.deps import get_current_user_with_role

router = APIRouter()

@router.post("/link", response_model=ProjectSiteResponse, status_code=status.HTTP_201_CREATED)
def link_project_site(
    link_in: ProjectSiteLink,
    db: Session = Depends(get_db),
    user_mem: tuple = Depends(get_current_user_with_role(["admin", "site_manager"]))
):
    current_user, membership = user_mem
    
    # Validate project
    project = db.query(Project).filter(
        Project.id == link_in.project_id,
        Project.organization_id == membership.organization_id
    ).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Validate site
    site = db.query(Site).filter(
        Site.id == link_in.site_id,
        Site.organization_id == membership.organization_id
    ).first()
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")

    # Check existing link
    existing = db.query(ProjectSite).filter(
        ProjectSite.project_id == link_in.project_id,
        ProjectSite.site_id == link_in.site_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Project and Site are already linked")

    project_site = ProjectSite(
        project_id=link_in.project_id,
        site_id=link_in.site_id
    )
    db.add(project_site)
    db.commit()
    db.refresh(project_site)
    return project_site

@router.delete("/unlink", status_code=status.HTTP_204_NO_CONTENT)
def unlink_project_site(
    project_id: str,
    site_id: str,
    db: Session = Depends(get_db),
    user_mem: tuple = Depends(get_current_user_with_role(["admin", "site_manager"]))
):
    current_user, membership = user_mem
    
    # Validate project and site ownership indirectly by checking link and organization
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.organization_id == membership.organization_id
    ).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    project_site = db.query(ProjectSite).filter(
        ProjectSite.project_id == project_id,
        ProjectSite.site_id == site_id
    ).first()
    
    if not project_site:
        raise HTTPException(status_code=404, detail="Link not found")
        
    db.delete(project_site)
    db.commit()
    return None
