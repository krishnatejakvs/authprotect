import asyncio
from fastapi import UploadFile
from app.services.storage import StorageService
from app.core.config import settings
import tempfile
from fastapi.datastructures import Headers

async def main():
    print("SUPABASE_URL:", settings.SUPABASE_URL)
    with tempfile.NamedTemporaryFile() as tf:
        tf.write(b"fake image data")
        tf.seek(0)
        upload_file = UploadFile(
            filename="test.jpg", 
            file=tf, 
            headers=Headers({"content-type": "image/jpeg"})
        )
        url = await StorageService.save_project_cover_image(upload_file, "123")
        print("Success:", url)

if __name__ == "__main__":
    asyncio.run(main())
