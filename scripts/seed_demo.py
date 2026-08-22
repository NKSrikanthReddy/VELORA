import os
import sys
from datetime import datetime, timedelta

# Ensure project root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.database import SessionLocal, engine, Base
from app.models import (
    User, Patient, Document, MedicalEvent, Medication,
    LabResult, DoctorPatientAccess, Summary, ChatSession,
    ChatMessage, ChatEvidence
)
from app.utils.security import hash_password
from app.utils.access_codes import generate_access_code

def seed_demo_data():
    print("Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        print("Cleaning previous demo records...")
        db.query(ChatEvidence).delete()
        db.query(ChatMessage).delete()
        db.query(ChatSession).delete()
        db.query(Summary).delete()
        db.query(DoctorPatientAccess).delete()
        db.query(LabResult).delete()
        db.query(Medication).delete()
        db.query(MedicalEvent).delete()
        db.query(Document).delete()
        db.query(Patient).delete()
        db.query(User).delete()
        db.commit()

        print("Seeding fictional Patient and Doctor users...")
        # 1. Create Patient User
        patient_pwd = hash_password("patient123")
        patient_user = User(
            name="Rahul Sharma",
            email="patient@demo.com",
            password_hash=patient_pwd,
            role="patient"
        )
        db.add(patient_user)

        # 2. Create Doctor User
        doctor_pwd = hash_password("doctor123")
        doctor_user = User(
            name="Dr. Ananya Roy",
            email="doctor@demo.com",
            password_hash=doctor_pwd,
            role="doctor"
        )
        db.add(doctor_user)
        db.commit()
        db.refresh(patient_user)
        db.refresh(doctor_user)

        # 3. Create Patient Profile
        patient = Patient(
            user_id=patient_user.id,
            name="Rahul Sharma",
            date_of_birth="1982-05-14",
            gender="Male"
        )
        db.add(patient)
        db.commit()
        db.refresh(patient)

        print("Seeding 7 fictional medical documents...")
        fictional_docs = [
            {
                "filename": "1_initial_consultation_2023.pdf",
                "type": "consultation",
                "text": "City Hospital Outpatient Clinic. Date: 2023-05-12. Patient: Rahul Sharma (42M). Chief Complaint: Increased thirst, frequent urination, fatigue over past 3 months. Vitals: BP 130/84, HR 74, BMI 27.4. Assessment: Suspected Type 2 Diabetes Mellitus. Plan: Order HbA1c, Fasting Blood Glucose, Lipid Profile.",
                "date": "2023-05-12"
            },
            {
                "filename": "2_lab_report_hba1c_2023.pdf",
                "type": "lab_report",
                "text": "Metro Diagnostics Panel. Date: 2023-05-15. Patient: Rahul Sharma. HbA1c: 8.1% (High, Ref: <5.7%). Fasting Glucose: 162 mg/dL (High, Ref: 70-99 mg/dL). Total Cholesterol: 215 mg/dL (High, Ref: <200). Serum Creatinine: 0.9 mg/dL (Normal).",
                "date": "2023-05-15"
            },
            {
                "filename": "3_prescription_diabetes_2023.pdf",
                "type": "prescription",
                "text": "City Health Clinic Rx. Date: 2023-05-18. Doctor: Dr. V. Verma. Patient: Rahul Sharma. 1. Metformin 500mg PO Twice Daily with meals. 2. Atorvastatin 10mg PO QD at bedtime.",
                "date": "2023-05-18"
            },
            {
                "filename": "4_follow_up_consultation_2024.pdf",
                "type": "follow_up",
                "text": "Outpatient Follow-up Notes. Date: 2024-01-10. Patient reports good compliance with Metformin. Energy levels improved. BP 124/80. Weight down 2 kg. Continue Metformin 500mg BID.",
                "date": "2024-01-10"
            },
            {
                "filename": "5_admission_gastroenteritis_2024.pdf",
                "type": "admission",
                "text": "Apex Emergency Admission. Date: 2024-06-20. Patient admitted with severe nausea, vomiting, watery diarrhea, mild dehydration. Vitals: Temp 100.2F, BP 110/70. Diagnosis: Acute Viral Gastroenteritis.",
                "date": "2024-06-20"
            },
            {
                "filename": "6_discharge_summary_2024.pdf",
                "type": "discharge_summary",
                "text": "Apex Hospital Discharge Summary. Date: 2024-06-22. Admitted: 2024-06-20. Discharged: 2024-06-22. Treatment: IV Normal Saline rehydration, Ondansetron. Condition on discharge: Asymptomatic, tolerating oral diet. Resume Metformin.",
                "date": "2024-06-22"
            },
            {
                "filename": "7_recent_lab_checkup_2025.pdf",
                "type": "lab_report",
                "text": "Metro Diagnostics Annual Checkup. Date: 2025-02-01. Patient: Rahul Sharma. HbA1c: 7.4% (Improved, Ref: <5.7%). Fasting Glucose: 138 mg/dL. Triglycerides: 160 mg/dL.",
                "date": "2025-02-01"
            }
        ]

        doc_objs = []
        for d_info in fictional_docs:
            doc = Document(
                patient_id=patient.id,
                filename=d_info["filename"],
                document_type=d_info["type"],
                storage_url=f"/api/documents/file/{patient.id}/{d_info['filename']}",
                mime_type="application/pdf",
                file_size=1024 * 45,
                processing_status="completed",
                extracted_text=d_info["text"]
            )
            db.add(doc)
            doc_objs.append((doc, d_info))
        db.commit()

        print("Seeding medical events, medications, and lab results...")
        # 4. Create Medical Events & structured items
        # Doc 1 Event
        ev1 = MedicalEvent(
            patient_id=patient.id,
            document_id=doc_objs[0][0].id,
            event_date="2023-05-12",
            event_type="consultation",
            title="Initial Diabetes Evaluation",
            description="Patient evaluated for polyuria and polydipsia. Suspected T2DM.",
            confidence="high",
            page_number=1,
            source_text=doc_objs[0][1]["text"]
        )
        db.add(ev1)

        # Doc 2 Event & Lab
        ev2 = MedicalEvent(
            patient_id=patient.id,
            document_id=doc_objs[1][0].id,
            event_date="2023-05-15",
            event_type="lab_report",
            title="Elevated HbA1c & Fasting Blood Sugar Documented",
            description="Baseline lab panel confirms HbA1c 8.1% and Fasting Blood Sugar 162 mg/dL.",
            confidence="high",
            page_number=1,
            source_text=doc_objs[1][1]["text"]
        )
        db.add(ev2)
        db.commit()

        lab1 = LabResult(
            patient_id=patient.id,
            event_id=ev2.id,
            test_name="HbA1c",
            value="8.1",
            unit="%",
            reference_range="<5.7 %",
            status="high",
            source_document_id=doc_objs[1][0].id,
            page_number=1,
            source_text="HbA1c: 8.1% (High, Ref: <5.7%)"
        )
        lab2 = LabResult(
            patient_id=patient.id,
            event_id=ev2.id,
            test_name="Fasting Blood Sugar",
            value="162",
            unit="mg/dL",
            reference_range="70-99 mg/dL",
            status="high",
            source_document_id=doc_objs[1][0].id,
            page_number=1,
            source_text="Fasting Glucose: 162 mg/dL"
        )
        db.add_all([lab1, lab2])

        # Doc 3 Event & Medication
        ev3 = MedicalEvent(
            patient_id=patient.id,
            document_id=doc_objs[2][0].id,
            event_date="2023-05-18",
            event_type="prescription",
            title="Metformin & Atorvastatin Initiated",
            description="Started Metformin 500mg BID for glycemic control and Atorvastatin 10mg QD for lipid management.",
            confidence="high",
            page_number=1,
            source_text=doc_objs[2][1]["text"]
        )
        db.add(ev3)
        db.commit()

        med1 = Medication(
            patient_id=patient.id,
            event_id=ev3.id,
            name="Metformin",
            normalized_name="Metformin",
            dosage="500mg",
            frequency="Twice Daily",
            route="Oral",
            status="active",
            source_document_id=doc_objs[2][0].id,
            page_number=1,
            source_text="Metformin 500mg PO Twice Daily with meals"
        )
        med2 = Medication(
            patient_id=patient.id,
            event_id=ev3.id,
            name="Atorvastatin",
            normalized_name="Atorvastatin",
            dosage="10mg",
            frequency="Once Daily",
            route="Oral",
            status="active",
            source_document_id=doc_objs[2][0].id,
            page_number=1,
            source_text="Atorvastatin 10mg PO QD at bedtime"
        )
        db.add_all([med1, med2])

        # Doc 6 Event (Discharge)
        ev6 = MedicalEvent(
            patient_id=patient.id,
            document_id=doc_objs[5][0].id,
            event_date="2024-06-22",
            event_type="discharge_summary",
            title="Hospital Discharge - Acute Gastroenteritis",
            description="Discharged following 2-day hospital admission for gastroenteritis rehydration. Metformin resumed.",
            confidence="high",
            page_number=1,
            source_text=doc_objs[5][1]["text"]
        )
        db.add(ev6)

        # Doc 7 Event (Recent Lab)
        ev7 = MedicalEvent(
            patient_id=patient.id,
            document_id=doc_objs[6][0].id,
            event_date="2025-02-01",
            event_type="lab_report",
            title="Annual Checkup - HbA1c Improved to 7.4%",
            description="Follow-up labs show HbA1c improvement from 8.1% to 7.4%.",
            confidence="high",
            page_number=1,
            source_text=doc_objs[6][1]["text"]
        )
        db.add(ev7)
        db.commit()

        lab3 = LabResult(
            patient_id=patient.id,
            event_id=ev7.id,
            test_name="HbA1c",
            value="7.4",
            unit="%",
            reference_range="<5.7 %",
            status="high",
            source_document_id=doc_objs[6][0].id,
            page_number=1,
            source_text="HbA1c: 7.4% (Improved, Ref: <5.7%)"
        )
        db.add(lab3)

        print("Seeding patient access code and active doctor access...")
        # 5. Create Access Code & Doctor Access
        access_code_str = "MED-7K29X"
        access = DoctorPatientAccess(
            patient_id=patient.id,
            doctor_id=doctor_user.id,
            access_code=access_code_str,
            status="active",
            granted_at=datetime.utcnow(),
            expires_at=datetime.utcnow() + timedelta(days=7)
        )
        db.add(access)
        db.commit()

        print("Seeding patient summary...")
        # 6. Create Clinical Briefing Summary
        summary_json = {
            "patient_overview": "Rahul Sharma (42M) with documented Type 2 Diabetes Mellitus diagnosed in May 2023. Glycemic control has shown improvement with HbA1c decreasing from 8.1% to 7.4% on Metformin therapy.",
            "major_diagnoses": ["Type 2 Diabetes Mellitus", "Dyslipidemia", "Acute Gastroenteritis (Resolved)"],
            "medical_history": ["2023-05: Type 2 Diabetes Mellitus documented.", "2024-06: Brief hospitalization for viral gastroenteritis."],
            "previous_procedures": ["IV Fluid Rehydration (2024-06)"],
            "medications": [
                {"name": "Metformin", "dosage": "500mg", "frequency": "Twice Daily", "status": "active"},
                {"name": "Atorvastatin", "dosage": "10mg", "frequency": "Once Daily", "status": "active"}
            ],
            "important_lab_results": [
                {"test_name": "HbA1c", "value": "7.4", "unit": "%", "status": "improved (was 8.1%)"},
                {"test_name": "Fasting Blood Sugar", "value": "138", "unit": "mg/dL", "status": "elevated"}
            ],
            "recent_events": [
                {"date": "2025-02-01", "type": "lab_report", "title": "Annual Checkup - HbA1c 7.4%"},
                {"date": "2024-06-22", "type": "discharge_summary", "title": "Hospital Discharge - Acute Gastroenteritis"}
            ],
            "important_points_for_doctor": [
                "HbA1c is improving (8.1% -> 7.4%) but remains above 7.0% target.",
                "Good adherence to Metformin 500mg BID and Atorvastatin 10mg QD on record."
            ],
            "uncertain_information": [],
            "conflicts": []
        }
        summary_obj = Summary(
            patient_id=patient.id,
            summary_json=summary_json,
            model_name="gemini-2.5-flash"
        )
        db.add(summary_obj)
        db.commit()

        print("Seeding Q&A chat session and evidence...")
        # 7. Create Q&A Chat Session
        chat_sess = ChatSession(
            patient_id=patient.id,
            doctor_id=doctor_user.id
        )
        db.add(chat_sess)
        db.commit()
        db.refresh(chat_sess)

        msg1 = ChatMessage(
            session_id=chat_sess.id,
            role="doctor",
            message="What medications has this patient taken for diabetes?"
        )
        msg2 = ChatMessage(
            session_id=chat_sess.id,
            role="assistant",
            message="According to the patient's documented medical records, Rahul Sharma is prescribed Metformin 500mg twice daily for diabetes control (initiated May 18, 2023)."
        )
        db.add_all([msg1, msg2])
        db.commit()
        db.refresh(msg2)

        ev_chat = ChatEvidence(
            message_id=msg2.id,
            document_id=doc_objs[2][0].id,
            page_number=1,
            source_text="Metformin 500mg PO Twice Daily with meals",
            relevance_score=0.96
        )
        db.add(ev_chat)
        db.commit()

        print("\n========================================================")
        print("DEMO DATA SEEDED SUCCESSFULLY!")
        print("========================================================")
        print(f"Patient Login: patient@demo.com  / password: patient123")
        print(f"Doctor Login:  doctor@demo.com   / password: doctor123")
        print(f"Patient Access Code: {access_code_str}")
        print(f"Patient ID:          {patient.id}")
        print(f"Doctor User ID:      {doctor_user.id}")
        print("========================================================")

    except Exception as e:
        db.rollback()
        print(f"Error seeding demo data: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_demo_data()
