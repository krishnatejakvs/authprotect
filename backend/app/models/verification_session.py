from sqlalchemy import Column, String, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
import enum

from app.core.database import Base

class VerificationStatus(str, enum.Enum):
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"

class VerificationSession(Base):
    __tablename__ = "verification_sessions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    image_url = Column(String, nullable=True) # Could be a link to S3 or local storage, or null if transient
    status = Column(String, default=VerificationStatus.IN_PROGRESS.value)

    # Relationships
    result = relationship("VerificationResult", back_populates="session", uselist=False, cascade="all, delete-orphan")
