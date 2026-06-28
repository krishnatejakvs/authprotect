from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class AuthenticationTokenResponse(BaseModel):
    id: str
    image_url: str
    token_hash: str
    created_at: datetime

    class Config:
        orm_mode = True

class ProductIdentityResponse(BaseModel):
    id: str
    batch_id: str
    serial_number: int
    created_at: datetime
    authentication_token: Optional[AuthenticationTokenResponse]

    class Config:
        orm_mode = True
