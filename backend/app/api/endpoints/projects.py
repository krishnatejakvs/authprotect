from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse
from app.api.deps import get_current_user_with_role
from app.services.storage import StorageService

router = APIRouter()

@router.post("/", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(
    project_in: ProjectCreate,
    db: Session = Depends(get_db),
    user_mem: tuple = Depends(get_current_user_with_role(["admin"]))
):
    current_user, membership = user_mem
    project = Project(
        organization_id=membership.organization_id,
        name=project_in.name,
        description=project_in.description
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project

@router.get("/", response_model=List[ProjectResponse])
def list_projects(
    db: Session = Depends(get_db),
    user_mem: tuple = Depends(get_current_user_with_role())
):
    current_user, membership = user_mem
    projects = db.query(Project).filter(
        Project.organization_id == membership.organization_id,
        Project.status != "archived"
    ).all()
    return projects

@router.put("/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: str,
    project_in: ProjectUpdate,
    db: Session = Depends(get_db),
    user_mem: tuple = Depends(get_current_user_with_role(["admin"]))
):
    current_user, membership = user_mem
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.organization_id == membership.organization_id,
        Project.status != "archived"
    ).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    project.name = project_in.name
    project.description = project_in.description
    db.commit()
    db.refresh(project)
    return project

@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: str,
    db: Session = Depends(get_db),
    user_mem: tuple = Depends(get_current_user_with_role(["admin"]))
):
    current_user, membership = user_mem
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.organization_id == membership.organization_id,
        Project.status != "archived"
    ).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    project.status = "archived"
    db.commit()
    return None

@router.post("/{project_id}/cover", response_model=ProjectResponse)
async def upload_project_cover(
    project_id: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user_mem: tuple = Depends(get_current_user_with_role(["admin"]))
):
    current_user, membership = user_mem
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.organization_id == membership.organization_id,
        Project.status != "archived"
    ).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid file type. Only JPEG, PNG, and WEBP are allowed.")
        
    # Validate file size (e.g., max 5MB)
    MAX_SIZE = 5 * 1024 * 1024
    content = await file.read()
    if len(content) > MAX_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Maximum size is 5MB.")
        
    # Reset file cursor for saving after reading to check size
    await file.seek(0)
    
    # Save image
    cover_image_url = await StorageService.save_project_cover_image(file, project_id)
    
    # Update project
    project.cover_image_url = cover_image_url
    db.commit()
    db.refresh(project)
    
    return project
