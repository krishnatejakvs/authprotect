from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta

from app.core.database import get_db
from app.models.invitation import Invitation
from app.models.membership import Membership
from app.schemas.invitation import InvitationCreate, InvitationResponse
from app.api.deps import get_current_user_with_role

router = APIRouter()

@router.post("/", response_model=InvitationResponse, status_code=status.HTTP_201_CREATED)
def invite_user(
    inv_in: InvitationCreate,
    db: Session = Depends(get_db),
    user_mem: tuple = Depends(get_current_user_with_role(["admin"]))
):
    current_user, membership = user_mem
    
    # Check if already invited and pending
    existing = db.query(Invitation).filter(
        Invitation.email == inv_in.email,
        Invitation.organization_id == membership.organization_id,
        Invitation.status == "pending"
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="User already invited")
        
    invitation = Invitation(
        organization_id=membership.organization_id,
        email=inv_in.email,
        role=inv_in.role,
        expires_at=datetime.utcnow() + timedelta(days=7)
    )
    db.add(invitation)
    db.commit()
    db.refresh(invitation)
    
    # TODO: Send email here (mock or actual service)
    
    return invitation

@router.get("/", response_model=List[InvitationResponse])
def list_invitations(
    db: Session = Depends(get_db),
    user_mem: tuple = Depends(get_current_user_with_role(["admin"]))
):
    current_user, membership = user_mem
    invitations = db.query(Invitation).filter(
        Invitation.organization_id == membership.organization_id,
        Invitation.status == "pending"
    ).all()
    return invitations

@router.delete("/{invitation_id}", status_code=status.HTTP_204_NO_CONTENT)
def revoke_invitation(
    invitation_id: str,
    db: Session = Depends(get_db),
    user_mem: tuple = Depends(get_current_user_with_role(["admin"]))
):
    current_user, membership = user_mem
    invitation = db.query(Invitation).filter(
        Invitation.id == invitation_id,
        Invitation.organization_id == membership.organization_id
    ).first()
    
    if not invitation:
        raise HTTPException(status_code=404, detail="Invitation not found")
        
    invitation.status = "revoked"
    db.commit()
    return None
