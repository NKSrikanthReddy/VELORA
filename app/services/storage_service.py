import os
import shutil
from typing import Tuple
from app.config import settings

class StorageService:
    def __init__(self):
        self.supabase_client = None
        if settings.SUPABASE_URL and settings.SUPABASE_KEY:
            try:
                from supabase import create_client
                self.supabase_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
            except Exception as e:
                print(f"[StorageService] Supabase initialization failed, using local storage: {e}")
        
        # Ensure local storage dir exists
        os.makedirs(settings.LOCAL_STORAGE_DIR, exist_ok=True)

    def save_file(self, file_bytes: bytes, patient_id: str, filename: str) -> Tuple[str, str]:
        """
        Save file to Supabase Storage or Local Storage fallback.
        Returns tuple of (storage_url, relative_storage_path).
        """
        relative_path = f"{patient_id}/{filename}"
        
        if self.supabase_client and settings.SUPABASE_BUCKET:
            try:
                res = self.supabase_client.storage.from_(settings.SUPABASE_BUCKET).upload(
                    path=relative_path,
                    file=file_bytes,
                    file_options={"upsert": "true"}
                )
                url = self.supabase_client.storage.from_(settings.SUPABASE_BUCKET).get_public_url(relative_path)
                return url, relative_path
            except Exception as e:
                print(f"[StorageService] Supabase upload failed, falling back to local storage: {e}")

        # Local storage fallback
        patient_dir = os.path.join(settings.LOCAL_STORAGE_DIR, patient_id)
        os.makedirs(patient_dir, exist_ok=True)
        local_path = os.path.join(patient_dir, filename)
        with open(local_path, "wb") as f:
            f.write(file_bytes)
        
        # Return a relative/local URL
        storage_url = f"/api/documents/file/{patient_id}/{filename}"
        return storage_url, local_path

    def get_file_bytes(self, patient_id: str, filename: str) -> bytes:
        local_path = os.path.join(settings.LOCAL_STORAGE_DIR, patient_id, filename)
        if os.path.exists(local_path):
            with open(local_path, "rb") as f:
                return f.read()
        raise FileNotFoundError(f"File not found locally at {local_path}")

storage_service = StorageService()
