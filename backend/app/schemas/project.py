from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(ProjectBase):
    pass

class ProjectResponse(ProjectBase):
    id: str
    organization_id: str
    cover_image_url: Optional[str] = None
    status: str
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
