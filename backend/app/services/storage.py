import os
import uuid
from fastapi import UploadFile
from supabase import create_client, Client
from app.core.config import settings

# Initialize Supabase client
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
BUCKET_NAME = "uploads"

class StorageService:
    @staticmethod
    async def save_project_cover_image(file: UploadFile, project_id: str) -> str:
        """
        Saves a project cover image to Supabase Storage and returns the public URL.
        """
        ext = os.path.splitext(file.filename)[1]
        unique_filename = f"projects/{project_id}_{uuid.uuid4().hex}{ext}"
        
        file_bytes = await file.read()
        
        # Upload to Supabase Storage
        supabase.storage.from_(BUCKET_NAME).upload(
            path=unique_filename,
            file=file_bytes,
            file_options={"content-type": file.content_type}
        )
        
        # Return the public URL
        return supabase.storage.from_(BUCKET_NAME).get_public_url(unique_filename)
