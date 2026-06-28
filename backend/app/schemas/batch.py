from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from .product_identity import ProductIdentityResponse

class BatchCreate(BaseModel):
    name: str
    project_id: str
    site_id: str
    quantity: int
    production_date: Optional[datetime] = None

class BatchResponse(BaseModel):
    id: str
    name: str
    project_id: str
    site_id: str
    quantity: int
    status: str
    created_at: datetime
    production_date: Optional[datetime] = None

    class Config:
        orm_mode = True

class BatchWithIdentitiesResponse(BatchResponse):
    identities: List[ProductIdentityResponse] = []
