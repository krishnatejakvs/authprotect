from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.site import Site
from app.schemas.site import SiteCreate, SiteUpdate, SiteResponse
from app.api.deps import get_current_user_with_role

router = APIRouter()

@router.post("/", response_model=SiteResponse, status_code=status.HTTP_201_CREATED)
def create_site(
    site_in: SiteCreate,
    db: Session = Depends(get_db),
    user_mem: tuple = Depends(get_current_user_with_role(["admin", "site_manager"]))
):
    current_user, membership = user_mem
    site = Site(
        organization_id=membership.organization_id,
        name=site_in.name,
        description=site_in.description
    )
    db.add(site)
    db.commit()
    db.refresh(site)
    return site

@router.get("/", response_model=List[SiteResponse])
def list_sites(
    db: Session = Depends(get_db),
    user_mem: tuple = Depends(get_current_user_with_role())
):
    current_user, membership = user_mem
    sites = db.query(Site).filter(
        Site.organization_id == membership.organization_id,
        Site.status != "archived"
    ).all()
    return sites

@router.put("/{site_id}", response_model=SiteResponse)
def update_site(
    site_id: str,
    site_in: SiteUpdate,
    db: Session = Depends(get_db),
    user_mem: tuple = Depends(get_current_user_with_role(["admin", "site_manager"]))
):
    current_user, membership = user_mem
    site = db.query(Site).filter(
        Site.id == site_id,
        Site.organization_id == membership.organization_id,
        Site.status != "archived"
    ).first()
    
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")
        
    site.name = site_in.name
    site.description = site_in.description
    db.commit()
    db.refresh(site)
    return site

@router.delete("/{site_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_site(
    site_id: str,
    db: Session = Depends(get_db),
    user_mem: tuple = Depends(get_current_user_with_role(["admin"]))
):
    current_user, membership = user_mem
    site = db.query(Site).filter(
        Site.id == site_id,
        Site.organization_id == membership.organization_id,
        Site.status != "archived"
    ).first()
    
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")
        
    site.status = "archived"
    db.commit()
    return None
