"""
File upload routes
"""
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from auth import require_admin
import os
import uuid
from pathlib import Path

router = APIRouter()

UPLOAD_DIR = "uploads"
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

@router.post("/admin/upload")
async def upload_file(
    file: UploadFile = File(...),
    current_user = Depends(require_admin)
):
    """Upload image file"""
    # Check file extension
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # Read file
    contents = await file.read()
    
    # Check file size
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Max size: {MAX_FILE_SIZE / 1024 / 1024}MB"
        )
    
    # Generate unique filename
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    # Save file
    with open(file_path, "wb") as f:
        f.write(contents)
    
    # Return URL
    file_url = f"/uploads/{unique_filename}"
    
    return {
        "url": file_url,
        "filename": unique_filename,
        "size": len(contents),
        "mimeType": file.content_type
    }
