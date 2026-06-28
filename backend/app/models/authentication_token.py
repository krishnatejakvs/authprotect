from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from app.core.database import Base

class AuthenticationToken(Base):
    __tablename__ = "authentication_tokens"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    product_identity_id = Column(String, ForeignKey("product_identities.id", ondelete="CASCADE"), unique=True, nullable=False)
    image_url = Column(String, nullable=False)
    token_hash = Column(String, nullable=False, unique=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    product_identity = relationship("ProductIdentity", back_populates="authentication_token")
