from pydantic import BaseModel, ConfigDict
from datetime import datetime

class OrganizationBase(BaseModel):
    name: str

class OrganizationCreate(OrganizationBase):
    pass

class OrganizationUpdate(OrganizationBase):
    pass

class OrganizationResponse(OrganizationBase):
    id: str
    created_at: datetime
    role: str | None = None
    
    model_config = ConfigDict(from_attributes=True)
