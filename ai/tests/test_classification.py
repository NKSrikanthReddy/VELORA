from ai.services.document_classifier import DocumentClassifier

def test_lab_report_classification():
    classifier = DocumentClassifier()
    res = classifier.classify("METRO DIAGNOSTICS LAB HbA1c 7.4% Fasting Glucose 145 mg/dL")
    assert res.document_type in {"lab_report", "unknown"}

def test_empty_text_classification():
    classifier = DocumentClassifier()
    res = classifier.classify("")
    assert res.document_type == "unknown"
    assert res.confidence == "low"
