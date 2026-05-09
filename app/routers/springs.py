from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.spring import Spring, ParticipantSpring
from schemas.spring import SpringCreate, SpringUpdate, SpringOut, AssignmentCreate, AssignmentOut
from typing import List

router = APIRouter(prefix="/springs", tags=["springs"])

@router.get("/", response_model=List[SpringOut])
def list_springs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Spring).offset(skip).limit(limit).all()

@router.post("/", response_model=SpringOut, status_code=201)
def create_spring(data: SpringCreate, db: Session = Depends(get_db)):
    spring = Spring(**data.model_dump())
    db.add(spring)
    db.commit()
    db.refresh(spring)
    return spring

@router.get("/{spring_id}", response_model=SpringOut)
def get_spring(spring_id: int, db: Session = Depends(get_db)):
    s = db.query(Spring).filter(Spring.id == spring_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Spring not found")
    return s

@router.patch("/{spring_id}", response_model=SpringOut)
def update_spring(spring_id: int, data: SpringUpdate, db: Session = Depends(get_db)):
    s = db.query(Spring).filter(Spring.id == spring_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Spring not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(s, field, value)
    db.commit()
    db.refresh(s)
    return s

@router.post("/assignments", response_model=AssignmentOut, status_code=201)
def assign_participant(data: AssignmentCreate, db: Session = Depends(get_db)):
    assignment = ParticipantSpring(**data.model_dump())
    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    return assignment
