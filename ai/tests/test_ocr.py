from PIL import Image
from ai.services.ocr_service import OCRService

def test_ocr_image_extraction():
    ocr = OCRService()
    img = Image.new("RGB", (100, 100), color="white")
    text = ocr.extract_from_image(img)
    assert isinstance(text, str)
    assert len(text) > 0

def test_ocr_pdf_page_fallback():
    ocr = OCRService(min_text_length=50)
    raw_pages = [{"page_number": 1, "text": "Short"}]
    processed = ocr.process_document(b"%PDF-1.4...", raw_pages)
    assert len(processed) == 1
    assert processed[0]["ocr_applied"] is True
