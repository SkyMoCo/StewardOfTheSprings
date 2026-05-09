from pydantic import BaseModel, EmailStr
from datetime import date
from typing import Optional
from models.participant import ParticipantStatus

class ParticipantBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: Optional[str] = None
    status: ParticipantStatus = ParticipantStatus.active

class ParticipantCreate(ParticipantBase):
    created_date: Optional[date] = None

class ParticipantUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    status: Optional[ParticipantStatus] = None

class ParticipantOut(ParticipantBase):
    id: int
    created_date: Optional[date]
    model_config = {"from_attributes": True}
