from pydantic import BaseModel, ConfigDict
from datetime import datetime

class ProjectSiteLink(BaseModel):
    project_id: str
    site_id: str

class ProjectSiteResponse(ProjectSiteLink):
    id: str
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
