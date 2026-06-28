from sqlalchemy import Column, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid

from app.core.database import Base

class Membership(Base):
    __tablename__ = "memberships"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    organization_id = Column(String, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    role = Column(String, nullable=False) # admin, site_manager, user
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")
    organization = relationship("Organization")
