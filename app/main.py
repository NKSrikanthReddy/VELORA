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

app = FastAPI(
    title="Velora Medical Record Consolidation & Briefing API",
    description="Patient-controlled medical record consolidation and clinical briefing platform.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS configuration
origins = [
    settings.FRONTEND_URL,
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Hackathon friendly full origin support
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables automatically on startup
@app.on_event("startup")
def startup_event():
    Base.metadata.create_all(bind=engine)

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
        "environment": "hackathon-demo"
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
