from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.config import settings
from app.database import engine, Base, get_db

# Import all models to ensure metadata registration
from app.models import *

from app.routers import (
    auth,
    patients,
    documents,
    timeline,
    summary,
    access,
    doctor,
    evidence,
    chat,
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create database tables automatically on startup
    Base.metadata.create_all(bind=engine)
    
    # Auto-seed default demo users if they don't exist
    from sqlalchemy.orm import sessionmaker
    from app.models.user import User, UserRole
    from app.models.patient import Patient
    from app.utils.security import get_password_hash
    
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    try:
        demo_patient = db.query(User).filter(User.email == "patient@demo.com").first()
        if not demo_patient:
            demo_patient = User(
                name="Rahul Sharma",
                email="patient@demo.com",
                hashed_password=get_password_hash("password123"),
                role=UserRole.PATIENT
            )
            db.add(demo_patient)
            db.commit()
            db.refresh(demo_patient)
            
            patient_profile = Patient(
                user_id=demo_patient.id,
                name=demo_patient.name,
                gender="Male",
                date_of_birth="1984-05-14"
            )
            db.add(patient_profile)
            db.commit()
            
        demo_doctor = db.query(User).filter(User.email == "doctor@demo.com").first()
        if not demo_doctor:
            demo_doctor = User(
                name="Dr. Anil Kumar",
                email="doctor@demo.com",
                hashed_password=get_password_hash("password123"),
                role=UserRole.DOCTOR
            )
            db.add(demo_doctor)
            db.commit()
    except Exception as e:
        print(f"[Seed] Demo user initialization: {e}")
    finally:
        db.close()

    yield

app = FastAPI(
    title="Velora Medical Record Consolidation & Briefing API",
    description="Patient-controlled medical record consolidation and clinical briefing platform.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Robust CORS configuration for Local Dev and Cloud Production
allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

if settings.FRONTEND_URL and settings.FRONTEND_URL not in allowed_origins:
    allowed_origins.append(settings.FRONTEND_URL)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https:\/\/.*\.vercel\.app|https:\/\/.*\.onrender\.com",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["General"])
def root():
    return {
        "name": "Velora Medical Record Consolidation API",
        "status": "online",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health", tags=["Health"])
def health_check(db: Session = Depends(get_db)):
    db_status = "connected"
    try:
        db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"error: {str(e)}"
    
    return {
        "status": "ok",
        "database": db_status,
        "environment": "production" if not settings.DATABASE_URL.startswith("sqlite") else "development"
    }

# Register API Routers
app.include_router(auth.router)
app.include_router(patients.router)
app.include_router(documents.router)
app.include_router(timeline.router)
app.include_router(summary.router)
app.include_router(access.router)
app.include_router(doctor.router)
app.include_router(evidence.router)
app.include_router(chat.router)
