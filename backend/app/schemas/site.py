from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class SiteBase(BaseModel):
    name: str
    description: Optional[str] = None

class SiteCreate(SiteBase):
    pass

class SiteUpdate(SiteBase):
    pass

class SiteResponse(SiteBase):
    id: str
    organization_id: str
    status: str
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
