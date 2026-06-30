from celery import Celery
import hashlib
import hmac
import os
import shutil

from app.core.config import settings
from app.core.database import SessionLocal
from app.models.batch import Batch, BatchStatus
from app.models.product_identity import ProductIdentity
from app.models.authentication_token import AuthenticationToken
from app.models.project import Project
from app.models.organization import Organization
from app.models.site import Site
from app.utils.steganography import embed_hmac_dct

celery_app = Celery(
    "authprotect_worker",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND
)

@celery_app.task
def generate_batch_identities_task(batch_id: str):
    db = SessionLocal()
    try:
        batch = db.query(Batch).filter(Batch.id == batch_id).first()
        if not batch:
            return
            
        batch.status = BatchStatus.PROCESSING
        db.commit()
        
        project = db.query(Project).filter(Project.id == batch.project_id).first()
        site = db.query(Site).filter(Site.id == batch.site_id).first()
        org = db.query(Organization).filter(Organization.id == project.organization_id).first()
        
        # If there's no project cover image, we should probably mock it or raise error
        base_image_url = project.cover_image_url if hasattr(project, 'cover_image_url') and project.cover_image_url else None
        
        base_image = f"/tmp/cover_{batch_id}.jpg"
        
        if not base_image_url or not base_image_url.startswith("http"):
            # Create a dummy image for testing if it doesn't exist
            import cv2
            import numpy as np
            dummy = np.zeros((256, 256, 3), dtype=np.uint8)
            cv2.imwrite(base_image, dummy)
        else:
            # Download from Supabase public URL
            import urllib.request
            try:
                urllib.request.urlretrieve(base_image_url, base_image)
            except Exception as e:
                # Fallback to dummy
                import cv2
                import numpy as np
                dummy = np.zeros((256, 256, 3), dtype=np.uint8)
                cv2.imwrite(base_image, dummy)
                print(f"Failed to download base image: {e}")
                
        from app.services.storage import supabase, BUCKET_NAME
        
        for serial_number in range(1, batch.quantity + 1):
            # Create identity
            identity = ProductIdentity(
                batch_id=batch.id,
                serial_number=serial_number
            )
            db.add(identity)
            db.commit()
            db.refresh(identity)
            
            # Generate HMAC token
            date_str = batch.created_at.strftime("%Y-%m-%d") if batch.created_at else "1970-01-01"
            data_to_hash = f"{batch.name}{project.name}{site.name}{date_str}{serial_number}"
            
            secret_key = org.encryption_key.encode('utf-8')
            hmac_token = hmac.new(secret_key, data_to_hash.encode('utf-8'), hashlib.sha256).hexdigest()
            
            # Embed into image locally
            final_url = ""
            try:
                output_image_path = embed_hmac_dct(base_image, hmac_token)
                
                # Upload to Supabase Storage
                unique_filename = f"products/{batch.id}_{serial_number}_{hmac_token}.jpg"
                # Upload to Supabase Storage
                supabase.storage.from_(BUCKET_NAME).upload(
                    path=unique_filename,
                    file=output_image_path,
                    file_options={"content-type": "image/jpeg"}
                )
                
                final_url = supabase.storage.from_(BUCKET_NAME).get_public_url(unique_filename)
                
                # Cleanup local product image
                if os.path.exists(output_image_path):
                    os.remove(output_image_path)
            except Exception as e:
                print(f"Failed to process or upload image: {e}")
                final_url = f"error_{hmac_token}.jpg"
                
            # Create auth token
            token = AuthenticationToken(
                product_identity_id=identity.id,
                image_url=final_url,
                token_hash=hmac_token
            )
            db.add(token)
            db.commit()
            
        # Cleanup base image
        if os.path.exists(base_image):
            os.remove(base_image)
            
        batch.status = BatchStatus.COMPLETED
        db.commit()
        
    except Exception as e:
        db.rollback()
        batch = db.query(Batch).filter(Batch.id == batch_id).first()
        if batch:
            batch.status = BatchStatus.FAILED
            db.commit()
        raise e
    finally:
        db.close()
