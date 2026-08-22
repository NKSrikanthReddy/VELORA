from ai.services.event_service import EventService
from ai.fixtures.demo_data import FICTIONAL_DOCUMENTS

def test_timeline_sorting_and_null_dates():
    service = EventService()
    all_events = []
    for doc in FICTIONAL_DOCUMENTS:
        evs = service.generate_events_from_extraction(
            extraction=doc["extraction"],
            patient_id="pat_123",
            document_id=doc["document_id"],
            filename=doc["filename"]
        )
        all_events.extend(evs)

    timeline = service.create_timeline(all_events, patient_id="pat_123")
    assert len(timeline.events) > 0

    # Ensure chronological order (excluding trailing null dates)
    dated_events = [e for e in timeline.events if e.event_date]
    dates = [e.event_date for e in dated_events]
    assert dates == sorted(dates)

    # Ensure null dates are placed at the end
    null_events = [e for e in timeline.events if e.event_date is None]
    if null_events:
        assert timeline.events[-1].event_date is None
