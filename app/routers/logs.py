from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.spring_log import SpringLog
from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional, List

router = APIRouter(prefix="/logs", tags=["logs"])

class LogCreate(BaseModel):
    spring_id: int
    participant_id: int
    visit_date: date
    notes: Optional[str] = None
    conditions_observed: Optional[str] = None
    photos_url: Optional[str] = None

class LogOut(LogCreate):
    id: int
    created_date: Optional[datetime]
    model_config = {"from_attributes": True}

@router.get("/", response_model=List[LogOut])
def list_logs(spring_id: Optional[int] = None, participant_id: Optional[int] = None,
              skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    q = db.query(SpringLog)
    if spring_id:
        q = q.filter(SpringLog.spring_id == spring_id)
    if participant_id:
        q = q.filter(SpringLog.participant_id == participant_id)
    return q.offset(skip).limit(limit).all()

@router.post("/", response_model=LogOut, status_code=201)
def create_log(data: LogCreate, db: Session = Depends(get_db)):
    log = SpringLog(**data.model_dump())
    db.add(log)
    db.commit()
    db.refresh(log)
    return log

@router.get("/{log_id}", response_model=LogOut)
def get_log(log_id: int, db: Session = Depends(get_db)):
    log = db.query(SpringLog).filter(SpringLog.id == log_id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")
    return log
