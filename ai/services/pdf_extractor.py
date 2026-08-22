import io
from typing import List, Dict, Any, Union
from pathlib import Path

class PDFExtractionError(Exception):
    """Base exception for PDF extraction failures."""
    pass

class InvalidPDFError(PDFExtractionError):
    """Raised when the input file is not a valid PDF."""
    pass

class CorruptedPDFError(PDFExtractionError):
    """Raised when the PDF document structure is corrupted."""
    pass

class PDFExtractor:
    """
    Extracts text page-by-page from PDF files or bytes.
    Preserves page number metadata for source attribution.
    """

    def extract(self, source: Union[str, Path, bytes]) -> List[Dict[str, Any]]:
        """
        Extract page-level text objects from PDF source.
        Returns:
            List[Dict[str, Any]]: List of dicts, each with 'page_number' (1-indexed) and 'text'.
        """
        if isinstance(source, (str, Path)):
            path = Path(source)
            if not path.exists():
                raise InvalidPDFError(f"PDF file does not exist: {source}")
            try:
                with open(path, "rb") as f:
                    pdf_bytes = f.read()
            except Exception as e:
                raise PDFExtractionError(f"Failed to read file {source}: {str(e)}")
        elif isinstance(source, bytes):
            pdf_bytes = source
        else:
            raise InvalidPDFError("Source must be a file path or bytes.")

        if not pdf_bytes or not pdf_bytes.startswith(b"%PDF"):
            raise InvalidPDFError("File content is not a valid PDF header.")

        pages_data = []
        
        # Attempt extraction using pypdf
        try:
            import pypdf
            stream = io.BytesIO(pdf_bytes)
            try:
                reader = pypdf.PdfReader(stream)
            except Exception as e:
                raise CorruptedPDFError(f"Corrupted PDF header/structure: {str(e)}")

            if len(reader.pages) == 0:
                return []

            for page_idx, page in enumerate(reader.pages):
                page_number = page_idx + 1
                try:
                    text = page.extract_text() or ""
                except Exception as e:
                    text = ""
                
                # Clean up whitespace
                cleaned_text = text.strip()
                pages_data.append({
                    "page_number": page_number,
                    "text": cleaned_text
                })
        except ImportError:
            # Fallback simple extractor for environments without pypdf
            pages_data = self._fallback_extract(pdf_bytes)

        return pages_data

    def _fallback_extract(self, pdf_bytes: bytes) -> List[Dict[str, Any]]:
        """Fallback basic text stream extractor for raw PDF bytes."""
        text_content = ""
        try:
            # Basic string search for text streams in raw pdf
            import re
            streams = re.findall(b"stream\r?\n(.*?)\r?\nendstream", pdf_bytes, re.DOTALL)
            extracted_chunks = []
            for stream in streams:
                # Try uncompressed text search
                matches = re.findall(rb"\((.*?)\)\s*Tj", stream)
                if matches:
                    chunk = b" ".join(matches).decode("ascii", errors="ignore")
                    if chunk.strip():
                        extracted_chunks.append(chunk.strip())
            text_content = "\n".join(extracted_chunks)
        except Exception:
            text_content = ""

        return [{"page_number": 1, "text": text_content}]
