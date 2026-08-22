import os
from pydantic import BaseModel

class AIConfig(BaseModel):
    ai_api_key: str = os.getenv("AI_API_KEY", "")
    ai_model: str = os.getenv("AI_MODEL", "gpt-4o-mini")
    ocr_provider: str = os.getenv("OCR_PROVIDER", "pytesseract")
    ocr_api_key: str = os.getenv("OCR_API_KEY", "")
    ocr_min_text_length: int = int(os.getenv("OCR_MIN_TEXT_LENGTH", "50"))
    demo_mode: bool = os.getenv("DEMO_MODE", "true").lower() == "true"

config = AIConfig()
