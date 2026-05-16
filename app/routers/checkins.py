from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.public_checkin import PublicCheckin
from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime

router = APIRouter(prefix="/checkins", tags=["checkins"])


class CheckinCreate(BaseModel):
    spring: str
    date: date
    actions: Optional[List[str]] = []
    notes: Optional[str] = None
    name: Optional[str] = None
    email: Optional[str] = None
    is_issue: bool = False
    submitted_at: Optional[str] = None


class CheckinOut(BaseModel):
    id: int
    spring_name: str
    visitor_name: Optional[str] = None
    visitor_email: Optional[str] = None
    visit_date: date
    actions: Optional[List[str]] = None
    notes: Optional[str] = None
    is_issue: bool
    submitted_at: Optional[str] = None
    created_at: Optional[datetime] = None
    model_config = {"from_attributes": True}


@router.post("/", status_code=201)
def create_checkin(data: CheckinCreate, db: Session = Depends(get_db)):
    checkin = PublicCheckin(
        spring_name=data.spring,
        visitor_name=data.name,
        visitor_email=data.email,
        visit_date=data.date,
        actions=data.actions,
        notes=data.notes,
        is_issue=data.is_issue,
        submitted_at=data.submitted_at,
    )
    db.add(checkin)
    db.commit()
    db.refresh(checkin)
    return {"id": checkin.id, "status": "recorded"}


@router.get("/", response_model=List[CheckinOut])
def list_checkins(skip: int = 0, limit: int = 500, db: Session = Depends(get_db)):
    return (
        db.query(PublicCheckin)
        .order_by(PublicCheckin.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
