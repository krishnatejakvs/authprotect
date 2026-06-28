from sqlalchemy import Column, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid

from app.core.database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    organization_id = Column(String, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    cover_image_url = Column(String, nullable=True)
    status = Column(String, default="active", nullable=False) # active, archived
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    organization = relationship("Organization")
