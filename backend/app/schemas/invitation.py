from pydantic import BaseModel, ConfigDict, EmailStr
from datetime import datetime
from typing import Optional

class InvitationBase(BaseModel):
    email: EmailStr
    role: str

class InvitationCreate(InvitationBase):
    pass

class InvitationResponse(InvitationBase):
    id: str
    organization_id: str
    status: str
    expires_at: datetime
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
