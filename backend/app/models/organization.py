from sqlalchemy import Column, String, DateTime
from sqlalchemy.sql import func
import uuid

from app.core.database import Base

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    name = Column(String, nullable=False)
    encryption_key = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
