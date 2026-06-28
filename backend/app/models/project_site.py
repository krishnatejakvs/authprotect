from sqlalchemy import Column, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid

from app.core.database import Base

class ProjectSite(Base):
    __tablename__ = "project_sites"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    project_id = Column(String, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    site_id = Column(String, ForeignKey("sites.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    project = relationship("Project")
    site = relationship("Site")
