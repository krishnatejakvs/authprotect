from sqlalchemy import Column, String, DateTime, ForeignKey, Integer
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from app.core.database import Base

class ProductIdentity(Base):
    __tablename__ = "product_identities"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    batch_id = Column(String, ForeignKey("batches.id", ondelete="CASCADE"), nullable=False)
    serial_number = Column(Integer, nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    batch = relationship("Batch", back_populates="identities")
    authentication_token = relationship("AuthenticationToken", back_populates="product_identity", uselist=False, cascade="all, delete-orphan")
