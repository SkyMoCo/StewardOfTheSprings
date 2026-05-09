from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.participant import Participant
from schemas.participant import ParticipantCreate, ParticipantUpdate, ParticipantOut
from typing import List

router = APIRouter(prefix="/participants", tags=["participants"])

@router.get("/", response_model=List[ParticipantOut])
def list_participants(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Participant).offset(skip).limit(limit).all()

@router.post("/", response_model=ParticipantOut, status_code=201)
def create_participant(data: ParticipantCreate, db: Session = Depends(get_db)):
    if db.query(Participant).filter(Participant.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    participant = Participant(**data.model_dump())
    db.add(participant)
    db.commit()
    db.refresh(participant)
    return participant

@router.get("/{participant_id}", response_model=ParticipantOut)
def get_participant(participant_id: int, db: Session = Depends(get_db)):
    p = db.query(Participant).filter(Participant.id == participant_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Participant not found")
    return p

@router.patch("/{participant_id}", response_model=ParticipantOut)
def update_participant(participant_id: int, data: ParticipantUpdate, db: Session = Depends(get_db)):
    p = db.query(Participant).filter(Participant.id == participant_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Participant not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(p, field, value)
    db.commit()
    db.refresh(p)
    return p

@router.delete("/{participant_id}", status_code=204)
def delete_participant(participant_id: int, db: Session = Depends(get_db)):
    p = db.query(Participant).filter(Participant.id == participant_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Participant not found")
    db.delete(p)
    db.commit()
