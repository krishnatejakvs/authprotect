from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.batch import Batch, BatchStatus
from app.models.project import Project
from app.models.site import Site
from app.schemas.batch import BatchCreate, BatchResponse, BatchWithIdentitiesResponse
from app.api.deps import get_current_user_with_role

from app.worker import generate_batch_identities_task

router = APIRouter()

@router.post("/", response_model=BatchResponse, status_code=status.HTTP_201_CREATED)
def create_batch(
    batch_in: BatchCreate,
    db: Session = Depends(get_db),
    user_mem: tuple = Depends(get_current_user_with_role(["admin", "site_manager"]))
):
    current_user, membership = user_mem
    
    # Verify project exists and belongs to the org
    project = db.query(Project).filter(Project.id == batch_in.project_id).first()
    if not project or project.organization_id != membership.organization_id:
        raise HTTPException(status_code=404, detail="Project not found")
        
    # Verify site exists and belongs to the org
    site = db.query(Site).filter(Site.id == batch_in.site_id).first()
    if not site or site.organization_id != membership.organization_id:
        raise HTTPException(status_code=404, detail="Site not found")
        
    batch = Batch(
        name=batch_in.name,
        project_id=batch_in.project_id,
        site_id=batch_in.site_id,
        quantity=batch_in.quantity,
        production_date=batch_in.production_date,
        status=BatchStatus.PENDING
    )
    db.add(batch)
    db.commit()
    db.refresh(batch)
    
    # Trigger celery task
    generate_batch_identities_task.delay(batch.id)
    
    return batch

@router.get("/", response_model=List[BatchResponse])
def get_organization_batches(
    db: Session = Depends(get_db),
    user_mem: tuple = Depends(get_current_user_with_role(["admin", "site_manager", "auditor"]))
):
    current_user, membership = user_mem
    
    batches = db.query(Batch).join(Project).filter(Project.organization_id == membership.organization_id).all()
    return batches

@router.get("/project/{project_id}", response_model=List[BatchResponse])
def get_project_batches(
    project_id: str,
    db: Session = Depends(get_db),
    user_mem: tuple = Depends(get_current_user_with_role(["admin", "site_manager", "auditor"]))
):
    current_user, membership = user_mem
    
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project or project.organization_id != membership.organization_id:
        raise HTTPException(status_code=404, detail="Project not found")
        
    batches = db.query(Batch).filter(Batch.project_id == project_id).all()
    return batches

@router.get("/{batch_id}", response_model=BatchWithIdentitiesResponse)
def get_batch(
    batch_id: str,
    db: Session = Depends(get_db),
    user_mem: tuple = Depends(get_current_user_with_role(["admin", "site_manager", "auditor"]))
):
    current_user, membership = user_mem
    
    batch = db.query(Batch).filter(Batch.id == batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")
        
    project = db.query(Project).filter(Project.id == batch.project_id).first()
    if not project or project.organization_id != membership.organization_id:
        raise HTTPException(status_code=403, detail="Forbidden")
        
    return batch
