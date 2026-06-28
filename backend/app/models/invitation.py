from sqlalchemy import Column, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid

from app.core.database import Base

class Invitation(Base):
    __tablename__ = "invitations"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    organization_id = Column(String, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    email = Column(String, nullable=False, index=True)
    role = Column(String, nullable=False) # admin, site_manager, user
    status = Column(String, default="pending", nullable=False) # pending, accepted, expired, revoked
    expires_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    organization = relationship("Organization")
