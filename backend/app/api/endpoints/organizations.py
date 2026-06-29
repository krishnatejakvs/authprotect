from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.organization import Organization
from app.models.membership import Membership
from app.models.user import User
from app.schemas.organization import OrganizationCreate, OrganizationUpdate, OrganizationResponse
from app.api.deps import get_current_user, get_current_user_with_role

router = APIRouter()

@router.get("/", response_model=List[OrganizationResponse])
def get_user_organizations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    memberships = db.query(Membership).filter(Membership.user_id == current_user.id).all()
    results = []
    for mem in memberships:
        org = db.query(Organization).filter(Organization.id == mem.organization_id).first()
        if org:
            org_dict = {
                "name": org.name,
                "id": org.id,
                "created_at": org.created_at,
                "role": mem.role
            }
            results.append(org_dict)
    return results

import secrets

@router.post("/", response_model=OrganizationResponse, status_code=status.HTTP_201_CREATED)
def create_organization(
    org_in: OrganizationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    org = Organization(
        name=org_in.name,
        encryption_key=secrets.token_urlsafe(32)
    )
    db.add(org)
    db.commit()
    db.refresh(org)
    
    # Creator becomes admin
    membership = Membership(user_id=current_user.id, organization_id=org.id, role="admin")
    db.add(membership)
    db.commit()
    
    return org

@router.get("/{org_id}", response_model=OrganizationResponse)
def get_organization(
    org_id: str,
    db: Session = Depends(get_db),
    user_mem: tuple = Depends(get_current_user_with_role())
):
    # The dependency already checks if user is a member of the organization passed in Header,
    # but the path parameter could differ from header. 
    # Usually we just rely on the Header for tenant context, or path param.
    # We should ensure the path org_id matches the user's membership.
    current_user, membership = user_mem
    if membership.organization_id != org_id:
        raise HTTPException(status_code=403, detail="Forbidden")
        
    org = db.query(Organization).filter(Organization.id == org_id).first()
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    return org

@router.put("/{org_id}", response_model=OrganizationResponse)
def update_organization(
    org_id: str,
    org_in: OrganizationUpdate,
    db: Session = Depends(get_db),
    user_mem: tuple = Depends(get_current_user_with_role(["admin"]))
):
    current_user, membership = user_mem
    if membership.organization_id != org_id:
        raise HTTPException(status_code=403, detail="Forbidden")
        
    org = db.query(Organization).filter(Organization.id == org_id).first()
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
        
    org.name = org_in.name
    db.commit()
    db.refresh(org)
    return org

@router.get("/{org_id}/users")
def get_organization_users(
    org_id: str,
    db: Session = Depends(get_db),
    user_mem: tuple = Depends(get_current_user_with_role(["admin", "site_manager", "auditor"]))
):
    current_user, membership = user_mem
    if membership.organization_id != org_id:
        raise HTTPException(status_code=403, detail="Forbidden")
        
    memberships = db.query(Membership).filter(Membership.organization_id == org_id).all()
    
    users = []
    for mem in memberships:
        user = db.query(User).filter(User.id == mem.user_id).first()
        if user:
            users.append({
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": mem.role,
                "status": "active"
            })
    return users

@router.delete("/{org_id}/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_organization_user(
    org_id: str,
    user_id: str,
    db: Session = Depends(get_db),
    user_mem: tuple = Depends(get_current_user_with_role(["admin"]))
):
    current_user, membership = user_mem
    if membership.organization_id != org_id:
        raise HTTPException(status_code=403, detail="Forbidden")
        
    mem_to_delete = db.query(Membership).filter(
        Membership.organization_id == org_id,
        Membership.user_id == user_id
    ).first()
    
    if not mem_to_delete:
        raise HTTPException(status_code=404, detail="User not found in organization")
        
    # Prevent removing oneself if they are the only admin
    if mem_to_delete.user_id == current_user.id:
        admin_count = db.query(Membership).filter(
            Membership.organization_id == org_id,
            Membership.role == "admin"
        ).count()
        if admin_count <= 1:
            raise HTTPException(status_code=400, detail="Cannot remove the only admin")
            
    db.delete(mem_to_delete)
    db.commit()
    
    # Optional: Delete the user entirely if they have no other memberships
    other_memberships = db.query(Membership).filter(Membership.user_id == user_id).count()
    if other_memberships == 0:
        user_to_delete = db.query(User).filter(User.id == user_id).first()
        if user_to_delete:
            db.delete(user_to_delete)
            db.commit()
            
    return None
