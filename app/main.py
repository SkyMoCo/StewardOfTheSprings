from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from routers import participants, springs, logs, milestones, admin, checkins

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Save Our Springs",
    description="Stewardship tracking for springs conservation",
    version="0.1.0",
    docs_url="/api/docs",
    openapi_url="/api/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://sos.skymoco.dev", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(participants.router, prefix="/api")
app.include_router(springs.router, prefix="/api")
app.include_router(logs.router, prefix="/api")
app.include_router(milestones.router, prefix="/api")
app.include_router(checkins.router, prefix="/api")
app.include_router(admin.router)

@app.get("/api")
def root():
    return {"status": "ok", "service": "Save Our Springs API"}

@app.get("/api/health")
def health():
    return {"status": "healthy"}
