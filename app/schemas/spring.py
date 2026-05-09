from pydantic import BaseModel
from typing import Optional
from models.spring import SpringStatus, AssignmentRole
from datetime import date

class SpringBase(BaseModel):
    name: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    description: Optional[str] = None
    region: Optional[str] = None
    status: SpringStatus = SpringStatus.active

class SpringCreate(SpringBase):
    pass

class SpringUpdate(BaseModel):
    name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    description: Optional[str] = None
    region: Optional[str] = None
    status: Optional[SpringStatus] = None

class SpringOut(SpringBase):
    id: int
    model_config = {"from_attributes": True}

class AssignmentCreate(BaseModel):
    participant_id: int
    spring_id: int
    role: AssignmentRole = AssignmentRole.volunteer
    assigned_date: Optional[date] = None

class AssignmentOut(AssignmentCreate):
    id: int
    model_config = {"from_attributes": True}
