from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.milestone import Milestone
from pydantic import BaseModel
from datetime import date
from typing import Optional, List

router = APIRouter(prefix="/milestones", tags=["milestones"])

class MilestoneCreate(BaseModel):
    participant_id: int
    spring_id: int
    milestone_type: str
    achieved_date: Optional[date] = None
    description: Optional[str] = None

class MilestoneOut(MilestoneCreate):
    id: int
    model_config = {"from_attributes": True}

@router.get("/", response_model=List[MilestoneOut])
def list_milestones(participant_id: Optional[int] = None, spring_id: Optional[int] = None,
                    db: Session = Depends(get_db)):
    q = db.query(Milestone)
    if participant_id:
        q = q.filter(Milestone.participant_id == participant_id)
    if spring_id:
        q = q.filter(Milestone.spring_id == spring_id)
    return q.all()

@router.post("/", response_model=MilestoneOut, status_code=201)
def create_milestone(data: MilestoneCreate, db: Session = Depends(get_db)):
    m = Milestone(**data.model_dump())
    db.add(m)
    db.commit()
    db.refresh(m)
    return m
