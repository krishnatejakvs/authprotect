from sqlalchemy import Column, String, Float, ForeignKey
from sqlalchemy.orm import relationship
import uuid
import enum

from app.core.database import Base

class VerificationOutcome(str, enum.Enum):
    AUTHENTIC = "authentic"
    COUNTERFEIT = "counterfeit"
    UNCERTAIN = "uncertain"

class VerificationResult(Base):
    __tablename__ = "verification_results"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    session_id = Column(String, ForeignKey("verification_sessions.id", ondelete="CASCADE"), nullable=False, unique=True)
    product_identity_id = Column(String, ForeignKey("product_identities.id", ondelete="SET NULL"), nullable=True)
    
    outcome = Column(String, nullable=False)
    confidence_score = Column(Float, nullable=True) # Percentage (0-100)
    explanation = Column(String, nullable=True)

    # Relationships
    session = relationship("VerificationSession", back_populates="result")
    product_identity = relationship("ProductIdentity")
