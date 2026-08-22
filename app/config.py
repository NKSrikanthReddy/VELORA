import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./velora.db"
    JWT_SECRET: str = "super-secret-jwt-key-velora-medical-hackathon-2026"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    FRONTEND_URL: str = "http://localhost:3000"

    AI_API_KEY: str = ""
    AI_MODEL: str = "gemini-2.5-flash"

    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    SUPABASE_BUCKET: str = "medical-records"

    MAX_FILE_SIZE_MB: int = 20
    LOCAL_STORAGE_DIR: str = "./storage"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
