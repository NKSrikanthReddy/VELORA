import pytest
from ai.services.pdf_extractor import PDFExtractor, InvalidPDFError, CorruptedPDFError

def test_invalid_pdf_header():
    extractor = PDFExtractor()
    with pytest.raises(InvalidPDFError):
        extractor.extract(b"Not a PDF file content")

def test_missing_file_path():
    extractor = PDFExtractor()
    with pytest.raises(InvalidPDFError):
        extractor.extract("/non/existent/file.pdf")

def test_corrupted_pdf_structure():
    extractor = PDFExtractor()
    fake_corrupted_pdf = b"%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\nstream\n(Hello Page 1) Tj\nendstream\n"
    with pytest.raises(CorruptedPDFError):
        extractor.extract(fake_corrupted_pdf)
