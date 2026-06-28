import os
import shutil
import uuid
from fastapi import UploadFile

UPLOAD_DIR = "uploads"
PROJECTS_UPLOAD_DIR = os.path.join(UPLOAD_DIR, "projects")

# Ensure directories exist
os.makedirs(PROJECTS_UPLOAD_DIR, exist_ok=True)

class StorageService:
    @staticmethod
    async def save_project_cover_image(file: UploadFile, project_id: str) -> str:
        """
        Saves a project cover image and returns the relative URL to access it.
        """
        # Generate a unique filename to prevent collisions
        ext = os.path.splitext(file.filename)[1]
        unique_filename = f"{project_id}_{uuid.uuid4().hex}{ext}"
        file_path = os.path.join(PROJECTS_UPLOAD_DIR, unique_filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # The URL will be served via FastAPI's StaticFiles mounted at /uploads
        return f"/uploads/projects/{unique_filename}"
