import os
import uuid
import shutil
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, BackgroundTasks
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.verification_session import VerificationSession, VerificationStatus
from app.models.verification_result import VerificationResult, VerificationOutcome
from app.models.authentication_token import AuthenticationToken
from app.models.product_identity import ProductIdentity
from app.utils.steganography import extract_hmac_dct

router = APIRouter()


@router.post("/verify")
async def verify_product(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Verify a physical product by uploading an image.
    Extracts the steganographic hash and validates it against the database.
    """
    # 1. Create a verification session
    session = VerificationSession(status=VerificationStatus.IN_PROGRESS.value)
    db.add(session)
    db.commit()
    db.refresh(session)
    
    # 2. Save uploaded file temporarily for OpenCV processing
    file_ext = os.path.splitext(file.filename)[1] if file.filename else ".jpg"
    temp_file_path = f"/tmp/{session.id}{file_ext}"
    
    with open(temp_file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Upload to Supabase Storage
    try:
        # Upload to Supabase Storage
        from app.services.storage import supabase, BUCKET_NAME
        
        unique_filename = f"verifications/{session.id}{file_ext}"
        
        supabase.storage.from_(BUCKET_NAME).upload(
            file=temp_file_path,
            path=unique_filename,
            file_options={"content-type": file.content_type}
        )
            
        session.image_url = supabase.storage.from_(BUCKET_NAME).get_public_url(unique_filename)
    except Exception as e:
        print(f"Failed to upload to Supabase: {e}")
        session.image_url = None
        
    db.commit()
    
    # 3. Extract hash using reverse DCT
    try:
        extracted_hash, confidence = extract_hmac_dct(temp_file_path)
    except Exception as e:
        extracted_hash, confidence = "", 0.0
        
    # 4. Resolve ProductIdentity
    outcome = VerificationOutcome.UNCERTAIN.value
    explanation = "We could not verify this product. It may be a counterfeit or the packaging might be damaged."
    product_identity = None
    
    if extracted_hash:
        # Check against database
        token = db.query(AuthenticationToken).filter(AuthenticationToken.token_hash == extracted_hash).first()
        if token:
            product_identity = token.product_identity
            outcome = VerificationOutcome.AUTHENTIC.value
            explanation = "Product is verified as authentic."
            confidence = 100.0 # Force 100% since we found an exact match
        else:
            if confidence > 0:
                outcome = VerificationOutcome.UNCERTAIN.value
                explanation = "A signature was found but it does not match our records. The packaging may be damaged or it may be a sophisticated counterfeit. Manual physical verification is recommended."
            else:
                outcome = VerificationOutcome.COUNTERFEIT.value
                explanation = "No valid signature found. This product is likely counterfeit."
    else:
        # No hash extracted
        if confidence > 0:
             outcome = VerificationOutcome.UNCERTAIN.value
             explanation = "Partial data was recovered but the signature is invalid. The packaging might be heavily damaged."
        else:
             outcome = VerificationOutcome.COUNTERFEIT.value
             explanation = "We could not verify this product. It may be a counterfeit or the packaging might be completely damaged."
             
    # 5. Save Verification Result
    result = VerificationResult(
        session_id=session.id,
        product_identity_id=product_identity.id if product_identity else None,
        outcome=outcome,
        confidence_score=confidence,
        explanation=explanation
    )
    db.add(result)
    
    # Update session status
    session.status = VerificationStatus.COMPLETED.value
    db.commit()
    db.refresh(result)
    
    # 6. Return payload
    response_data = {
        "session_id": session.id,
        "outcome": outcome,
        "confidence_score": confidence,
        "explanation": explanation,
        "product_details": None
    }
    
    if product_identity:
        response_data["product_details"] = {
            "serial_number": product_identity.serial_number,
            "product_name": product_identity.batch.project.name if (product_identity.batch and product_identity.batch.project) else "Unknown Product",
            "manufacturing_date": product_identity.created_at.isoformat(),
            "batch_name": product_identity.batch.name if product_identity.batch else "Unknown Batch"
        }
        
    return response_data

@router.get("/verifications")
def list_verifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    List all verification events for Admins.
    """
    # Simply return all for now.
    results = db.query(VerificationResult).all()
    
    data = []
    for r in results:
        data.append({
            "id": r.id,
            "session_id": r.session_id,
            "timestamp": r.session.timestamp.isoformat(),
            "image_url": r.session.image_url,
            "outcome": r.outcome,
            "confidence_score": r.confidence_score,
            "product_identity_id": r.product_identity_id,
            "explanation": r.explanation
        })
        
    return {"items": data, "total": len(data)}
